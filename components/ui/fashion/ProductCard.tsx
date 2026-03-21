'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Product } from '@/interfaces/product';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const router = useRouter();

    // Authentication disabled per user request
    const isLoggedIn = true;

    const handleProtectedAction = (action: string, callback?: () => void) => {
        if (callback) {
            callback();
        }
    };

    const toggleWishlist = () => {
        handleProtectedAction('wishlist', () => {
            setIsWishlisted((prev) => !prev);
        });
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative cursor-pointer">
            <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
            
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <CldImage
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={533}
                    crop="fill"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Badge */}
                {product.badge && (
                    <span
                        className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${product.badge === 'New'
                            ? 'bg-emerald-500 text-white'
                            : product.badge === 'Bestseller'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-500 text-white'
                            }`}
                    >
                        {product.badge}
                    </span>
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}

                {/* Wishlist Heart */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist();
                    }}
                    className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                >
                    <svg
                        className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-rose-600 fill-rose-600' : 'text-gray-600'
                            }`}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>

                {/* Add to Bag overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            handleProtectedAction('bag/cart', () => {
                                console.log('Added to bag:', product.name);
                            });
                        }}
                        className="w-full bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-colors duration-300"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase">{product.brand}</p>
                <h3 className="text-sm font-medium text-gray-900 mt-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-xs font-semibold text-emerald-600">({product.discount}% off)</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
