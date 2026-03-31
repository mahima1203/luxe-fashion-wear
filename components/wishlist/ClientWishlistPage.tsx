'use client';

import { useCartStore } from '@/app/store/cartStore';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hasToken } from '@/api/storeApi';

export default function ClientWishlistPage() {
    const router = useRouter();
    const pathname = usePathname();
    const wishlistItems = useCartStore((state) => state.wishlistItems);
    const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        if (!hasToken()) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        }
    }, [router, pathname]);

    const handleProtectedAction = (callback: () => void) => {
        if (!hasToken()) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }
        callback();
    };

    const handleMoveToBag = (product: any) => {
        handleProtectedAction(() => {
            addToCart(product);
            removeFromWishlist(product.id);
            toast.success('Moved to Bag', {
                description: `${product.name} has been moved to your bag.`,
                action: { label: 'View Bag', onClick: () => router.push('/cart') }
            });
        });
    };

    const handleRemove = (product: any) => {
        handleProtectedAction(() => {
            removeFromWishlist(product.id);
            toast.success('Removed from Wishlist', {
                description: `${product.name} removed.`
            });
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <FashionNavbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist <span className="text-gray-500 font-normal text-lg">({wishlistItems.length} items)</span></h1>
                
                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded shadow-sm border border-gray-100">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        <h2 className="text-xl font-medium text-gray-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items that you like in your wishlist. Review them anytime and easily move them to the bag.</p>
                        <Link href="/fashion-home" className="bg-[#d6003c] text-white px-8 py-3 rounded font-medium hover:bg-[#b00030] transition-colors shadow">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="bg-white border border-gray-200 rounded overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col relative">
                                <button 
                                    onClick={() => handleRemove(product)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-white z-10 transition-all border border-gray-200"
                                    title="Remove from Wishlist"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                
                                <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    <CldImage
                                        src={product.image}
                                        alt={product.name}
                                        width={400}
                                        height={533}
                                        crop="fill"
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    {product.badge && (
                                        <div className="absolute top-2 left-2 px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/90 text-gray-900 border border-gray-200">
                                            {product.badge}
                                        </div>
                                    )}
                                </Link>
                                
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{product.brand}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-grow">{product.name}</p>
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice > product.price && (
                                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                        {product.discount > 0 && (
                                            <span className="text-xs font-bold text-emerald-600">({product.discount}% OFF)</span>
                                        )}
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleMoveToBag(product)}
                                        className="w-full py-2.5 border border-gray-300 text-rose-600 font-bold text-xs uppercase tracking-wide rounded hover:border-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        Move to Bag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            
            <FashionFooter />
        </div>
    );
}
