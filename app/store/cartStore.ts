import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/interfaces/product';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cartItems: CartItem[];
    wishlistItems: Product[];
    cartCount: number;
    wishlistCount: number;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cartItems: [],
            wishlistItems: [],
            cartCount: 0,
            wishlistCount: 0,

            addToCart: (product) => set((state) => {
                const existingItem = state.cartItems.find(item => item.id === product.id);
                let newCartItems;
                if (existingItem) {
                    newCartItems = state.cartItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    newCartItems = [...state.cartItems, { ...product, quantity: 1 }];
                }
                const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                return { cartItems: newCartItems, cartCount: newCount };
            }),

            removeFromCart: (productId) => set((state) => {
                const newCartItems = state.cartItems.filter(item => item.id !== productId);
                const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                return { cartItems: newCartItems, cartCount: newCount };
            }),

            updateQuantity: (productId, quantity) => set((state) => {
                if (quantity <= 0) {
                    const newCartItems = state.cartItems.filter(item => item.id !== productId);
                    const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                    return { cartItems: newCartItems, cartCount: newCount };
                }
                const newCartItems = state.cartItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                );
                const newCount = newCartItems.reduce((acc, item) => acc + item.quantity, 0);
                return { cartItems: newCartItems, cartCount: newCount };
            }),

            addToWishlist: (product) => set((state) => {
                if (!state.wishlistItems.find(item => item.id === product.id)) {
                    const newWishlistItems = [...state.wishlistItems, product];
                    return { wishlistItems: newWishlistItems, wishlistCount: newWishlistItems.length };
                }
                return state;
            }),

            removeFromWishlist: (productId) => set((state) => {
                const newWishlistItems = state.wishlistItems.filter(item => item.id !== productId);
                return { wishlistItems: newWishlistItems, wishlistCount: newWishlistItems.length };
            })
        }),
        {
            name: 'luxe-cart-storage',
        }
    )
);
