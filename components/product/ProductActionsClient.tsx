'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/app/store/cartStore';
import { toast } from 'sonner';
import type { Product } from '@/interfaces/product';

export default function ProductActionsClient({ product }: { product: Product }) {
    const router = useRouter();
    const pathname = usePathname();
    const addToCart = useCartStore((state) => state.addToCart);
    const addToWishlist = useCartStore((state) => state.addToWishlist);

    const handleProtectedAction = (actionName: string) => {
        // Simple client-side auth check looking for our API token
        const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('luxe_token='));
        
        if (!hasToken) {
            // Not logged in -> send to login page, remember where we came from
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        // Action is allowed! Execute global state changes and Toast
        if (actionName.includes('Bag') || actionName.includes('Buy')) {
            addToCart(product);
            toast.success('Added to Bag', {
                description: `${product.name} has been securely added to your shopping bag.`,
                action: { label: 'View Bag', onClick: () => router.push('/cart') }
            });
            if (actionName.includes('Buy')) {
                router.push('/cart');
            }
        } else if (actionName.includes('Wishlist')) {
            addToWishlist(product);
            toast.success('Saved to Wishlist', {
                description: `${product.name} has been added to your wishlist.`,
                action: { label: 'View Wishlist', onClick: () => router.push('/wishlist') }
            });
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 flex items-center gap-3 z-40 md:static md:p-0 md:bg-transparent md:border-t-0 md:mt-auto">
            <button 
                onClick={() => handleProtectedAction('Share')}
                className="hidden md:flex items-center justify-center p-3 sm:px-4 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors"
                title="Share"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            </button>
            <button 
                onClick={() => handleProtectedAction('Add to Wishlist')}
                className="p-3 sm:px-4 border border-gray-300 rounded hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-gray-600 transition-colors"
                title="Wishlist"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <button 
                onClick={() => handleProtectedAction('Buy Now (Express Checkout)')}
                className="flex-1 bg-white border border-[#d6003c] text-[#d6003c] font-bold py-3 px-6 rounded hover:bg-rose-50 transition-colors text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
            >
                Buy Now
            </button>
            <button 
                onClick={() => handleProtectedAction('Add to Bag')}
                className="flex-1 bg-[#d6003c] hover:bg-[#b00030] text-white font-bold py-3 px-6 rounded transition-colors text-sm uppercase tracking-wide shadow-md focus:outline-none focus:ring-2 focus:ring-[#d6003c] focus:ring-offset-1"
            >
                Add To Bag
            </button>
        </div>
    );
}
