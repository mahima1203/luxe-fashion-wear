'use client';

import Image from 'next/image';
import { useState } from 'react';

const products = [
    {
        id: 1,
        brand: 'ZARA',
        name: 'Floral Wrap Midi Dress',
        price: 4999,
        originalPrice: 7999,
        discount: 38,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
        badge: 'Bestseller',
    },
    {
        id: 2,
        brand: 'H&M',
        name: 'Premium Linen Blazer',
        price: 3499,
        originalPrice: 5999,
        discount: 42,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80',
        badge: 'New',
    },
    {
        id: 3,
        brand: 'GUCCI',
        name: 'Leather Crossbody Bag',
        price: 12999,
        originalPrice: 18999,
        discount: 32,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
        badge: null,
    },
    {
        id: 4,
        brand: 'NIKE',
        name: 'Air Max Pulse Sneakers',
        price: 8999,
        originalPrice: 12999,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        badge: 'Trending',
    },
    {
        id: 5,
        brand: 'MANGO',
        name: 'Pleated Wide-Leg Trousers',
        price: 2799,
        originalPrice: 4499,
        discount: 38,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80',
        badge: null,
    },
    {
        id: 6,
        brand: 'RALPH LAUREN',
        name: 'Classic Polo Shirt',
        price: 5999,
        originalPrice: 8999,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80',
        badge: 'Bestseller',
    },
    {
        id: 7,
        brand: 'PRADA',
        name: 'Saffiano Card Holder',
        price: 6499,
        originalPrice: 9999,
        discount: 35,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
        badge: 'New',
    },
    {
        id: 8,
        brand: 'ADIDAS',
        name: 'Ultraboost Light Running',
        price: 9499,
        originalPrice: 14999,
        discount: 37,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
        badge: null,
    },
];

export default function TrendingProducts() {
    const [wishlist, setWishlist] = useState<number[]>([]);

    const toggleWishlist = (id: number) => {
        setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    return (
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
                    <div>
                        <span className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase">Curated for You</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2">Trending Now</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mt-4 rounded-full" />
                    </div>
                    <a
                        href="#"
                        className="mt-4 sm:mt-0 text-sm font-semibold text-rose-600 hover:text-rose-700 tracking-wider uppercase inline-flex items-center gap-1 group"
                    >
                        View All
                        <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                                <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                    -{product.discount}%
                                </span>

                                {/* Wishlist Heart */}
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                    <svg
                                        className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? 'text-rose-600 fill-rose-600' : 'text-gray-600'
                                            }`}
                                        fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
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
                                <div className="absolute inset-x-0 bottom-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <button className="w-full bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-colors duration-300">
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
                                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                    <span className="text-xs font-semibold text-emerald-600">({product.discount}% off)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
