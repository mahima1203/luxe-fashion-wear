import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/interfaces/product';
import * as storeApi from '@/api/storeApi';

export interface CartItem extends Product {
    quantity: number;
    db_id?: number; // Backend CartItem ID
    size?: string;
}

export interface WishlistItem extends Product {
    db_id?: number; // Backend WishlistItem ID
}

export const getLineItemId = (id: number, size?: string) => `${id}-${size || 'nosize'}`;

interface CartState {
    cartItems: CartItem[];
    wishlistItems: WishlistItem[];
    cartCount: number;
    selectedIds: string[]; // Line item IDs of selected items for checkout

    // Actions
    addToCart: (product: Product, quantity?: number, size?: string) => Promise<void>;
    removeFromCart: (productId: number, size?: string) => Promise<void>;
    updateQuantity: (productId: number, quantity: number, size?: string) => Promise<void>;
    
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;

    // Selection
    toggleSelect: (lineItemId: string) => void;
    setAllSelected: (selected: boolean) => void;
    clearSelected: () => void;

    // Sub state
    syncFromApi: () => Promise<void>;
    clearStore: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            wishlistItems: [],
            cartCount: 0,
            selectedIds: [],

            // Automatically fetches and populates actual DB state
            syncFromApi: async () => {
                try {
                    if (!storeApi.hasToken()) return;

                    const [apiCart, apiWishlist] = await Promise.all([
                        storeApi.fetchCartFromApi(),
                        storeApi.fetchWishlistFromApi()
                    ]);

                    // Map backend schema to frontend generic array
                    const cartItems: CartItem[] = apiCart.map((item: any) => ({
                        ...item.product,
                        quantity: item.quantity,
                        db_id: item.id,
                        size: item.size
                    }));

                    const wishlistItems: WishlistItem[] = apiWishlist.map((item: any) => ({
                        ...item.product,
                        db_id: item.id
                    }));

                    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                    // Sync selectedIds (only keep those that still exist in cart)
                    const currentSelected = get().selectedIds;
                    const validSelected = currentSelected.filter(lineId => cartItems.some(item => getLineItemId(item.id, item.size) === lineId));
                    
                    // If no one is selected, default to all (Standard expectation on refresh)
                    const newSelected = validSelected.length > 0 ? validSelected : cartItems.map(i => getLineItemId(i.id, i.size));

                    set({ cartItems, wishlistItems, cartCount, selectedIds: newSelected });
                } catch (error) {
                    console.error("Failed to sync store from API", error);
                }
            },

            clearStore: () => {
                set({ cartItems: [], wishlistItems: [], cartCount: 0, selectedIds: [] });
            },

            addToCart: async (product, quantity = 1, size?: string) => {
                try {
                    let db_id: number | undefined;

                    // 1. Sync backend if logged in
                    if (storeApi.hasToken()) {
                        const res = await storeApi.addToCartApi(product.id, quantity, size);
                        db_id = res.id;
                    }

                    // 2. Perform optimistic/local UI update
                    set((state) => {
                        const existingItem = state.cartItems.find(item => item.id === product.id && item.size === size);
                        let newCartItems: CartItem[];
                        if (existingItem) {
                            newCartItems = state.cartItems.map(item =>
                                item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + quantity, ...(db_id && { db_id }) } : item
                            );
                        } else {
                            newCartItems = [...state.cartItems, { ...product, quantity, size, db_id }];
                        }
                        const newCount = newCartItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
                        
                        // Auto-select the item if it's new
                        const lineId = getLineItemId(product.id, size);
                        const newSelectedIds = state.selectedIds.includes(lineId) 
                            ? state.selectedIds 
                            : [...state.selectedIds, lineId];

                        return { cartItems: newCartItems, cartCount: newCount, selectedIds: newSelectedIds };
                    });
                } catch (error) {
                    console.error("addToCart API Error", error);
                }
            },

            removeFromCart: async (productId, size) => {
                try {
                    const state = get();
                    const itemToRemove = state.cartItems.find(i => i.id === productId && i.size === size);

                    if (storeApi.hasToken() && itemToRemove?.db_id) {
                        await storeApi.removeFromCartApi(itemToRemove.db_id);
                    }

                    set((state) => {
                        const lineIdToRemove = getLineItemId(productId, size);
                        const newCartItems = state.cartItems.filter(item => getLineItemId(item.id, item.size) !== lineIdToRemove);
                        const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                        const newSelectedIds = state.selectedIds.filter(id => id !== lineIdToRemove);
                        return { cartItems: newCartItems, cartCount: newCount, selectedIds: newSelectedIds };
                    });
                } catch (error) {
                    console.error("removeFromCart API Error", error);
                }
            },

            updateQuantity: async (productId, quantity, size) => {
                if (quantity <= 0) {
                    await get().removeFromCart(productId, size);
                    return;
                }

                try {
                    const state = get();
                    const lineIdToUpdate = getLineItemId(productId, size);
                    const itemToUpdate = state.cartItems.find(i => getLineItemId(i.id, i.size) === lineIdToUpdate);

                    if (storeApi.hasToken() && itemToUpdate?.db_id) {
                        await storeApi.updateCartItemApi(itemToUpdate.db_id, quantity);
                    }

                    set((state) => {
                        const newCartItems = state.cartItems.map(item =>
                            getLineItemId(item.id, item.size) === lineIdToUpdate ? { ...item, quantity } : item
                        );
                        const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                        return { cartItems: newCartItems, cartCount: newCount };
                    });
                } catch (error) {
                    console.error("updateQuantity API Error", error);
                }
            },

            addToWishlist: async (product) => {
                try {
                    const state = get();
                    if (state.wishlistItems.find(item => item.id === product.id)) return;

                    let db_id: number | undefined;

                    if (storeApi.hasToken()) {
                        const res = await storeApi.addToWishlistApi(product.id);
                        db_id = res.id;
                    }

                    set((state) => {
                        return { wishlistItems: [...state.wishlistItems, { ...product, db_id }] };
                    });
                } catch (error) {
                    console.error("addToWishlist API Error", error);
                }
            },

            removeFromWishlist: async (productId) => {
                try {
                    const state = get();
                    const itemToRemove = state.wishlistItems.find(i => i.id === productId);

                    if (storeApi.hasToken() && itemToRemove?.db_id) {
                        await storeApi.removeFromWishlistApi(itemToRemove.db_id);
                    }

                    set((state) => {
                        return { wishlistItems: state.wishlistItems.filter(item => item.id !== productId) };
                    });
                } catch (error) {
                    console.error("removeFromWishlist API Error", error);
                }
            },

            toggleSelect: (lineItemId) => {
                set((state) => ({
                    selectedIds: state.selectedIds.includes(lineItemId)
                        ? state.selectedIds.filter(id => id !== lineItemId)
                        : [...state.selectedIds, lineItemId]
                }));
            },

            setAllSelected: (selected) => {
                const state = get();
                set({
                    selectedIds: selected ? state.cartItems.map(item => getLineItemId(item.id, item.size)) : []
                });
            },

            clearSelected: () => {
                set({ selectedIds: [] });
            }
        }),
        {
            name: 'luxe-cart-storage',
        }
    )
);
