import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/interfaces/product';
import * as storeApi from '@/api/storeApi';

export interface CartItem extends Product {
    quantity: number;
    db_id?: number; // Backend CartItem ID
}

export interface WishlistItem extends Product {
    db_id?: number; // Backend WishlistItem ID
}

interface CartState {
    cartItems: CartItem[];
    wishlistItems: WishlistItem[];
    cartCount: number;

    // Actions
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;

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
                        db_id: item.id
                    }));

                    const wishlistItems: WishlistItem[] = apiWishlist.map((item: any) => ({
                        ...item.product,
                        db_id: item.id
                    }));

                    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                    set({ cartItems, wishlistItems, cartCount });
                } catch (error) {
                    console.error("Failed to sync store from API", error);
                }
            },

            clearStore: () => {
                set({ cartItems: [], wishlistItems: [], cartCount: 0 });
            },

            addToCart: async (product, quantity = 1) => {
                try {
                    let db_id: number | undefined;

                    // 1. Sync backend if logged in
                    if (storeApi.hasToken()) {
                        const res = await storeApi.addToCartApi(product.id, quantity);
                        db_id = res.id;
                    }

                    // 2. Perform optimistic/local UI update
                    set((state) => {
                        const existingItem = state.cartItems.find(item => item.id === product.id);
                        let newCartItems;
                        if (existingItem) {
                            newCartItems = state.cartItems.map(item =>
                                item.id === product.id ? { ...item, quantity: item.quantity + quantity, ...(db_id && { db_id }) } : item
                            );
                        } else {
                            newCartItems = [...state.cartItems, { ...product, quantity, db_id }];
                        }
                        const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                        return { cartItems: newCartItems, cartCount: newCount };
                    });
                } catch (error) {
                    console.error("addToCart API Error", error);
                }
            },

            removeFromCart: async (productId) => {
                try {
                    const state = get();
                    const itemToRemove = state.cartItems.find(i => i.id === productId);

                    if (storeApi.hasToken() && itemToRemove?.db_id) {
                        await storeApi.removeFromCartApi(itemToRemove.db_id);
                    }

                    set((state) => {
                        const newCartItems = state.cartItems.filter(item => item.id !== productId);
                        const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                        return { cartItems: newCartItems, cartCount: newCount };
                    });
                } catch (error) {
                    console.error("removeFromCart API Error", error);
                }
            },

            updateQuantity: async (productId, quantity) => {
                if (quantity <= 0) {
                    await get().removeFromCart(productId);
                    return;
                }

                try {
                    const state = get();
                    const itemToUpdate = state.cartItems.find(i => i.id === productId);

                    if (storeApi.hasToken() && itemToUpdate?.db_id) {
                        await storeApi.updateCartItemApi(itemToUpdate.db_id, quantity);
                    }

                    set((state) => {
                        const newCartItems = state.cartItems.map(item =>
                            item.id === productId ? { ...item, quantity } : item
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
            }
        }),
        {
            name: 'luxe-cart-storage',
        }
    )
);
