'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const navLinks = [
    { name: 'Women', href: '/products/women' },
    { name: 'Men', href: '/products/men' },
    { name: 'Kids', href: '#' },
    { name: 'Accessories', href: '#' },
    { name: 'Brands', href: '#' },
];

export default function FashionNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSearchOpen(false);
        };
        if (isSearchOpen) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [isSearchOpen]);

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white text-center py-2.5 text-xs sm:text-sm font-medium tracking-wider">
                <span className="inline-flex items-center gap-2">
                    ✨ FREE SHIPPING on orders above ₹999 &nbsp;|&nbsp; Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">STYLE50</span> for 20% off ✨
                </span>
            </div>

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/fashion-home" className="flex items-center gap-1">
                            <span className="text-2xl lg:text-3xl font-black tracking-[0.25em] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                LUXE
                            </span>
                            <span className="text-[10px] font-light text-gray-400 tracking-widest -ml-0.5 mt-2">FASHION</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wider uppercase group"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                            <Link
                                href="#"
                                className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors tracking-wider uppercase animate-pulse"
                            >
                                Sale
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-500 hover:text-rose-600 transition-all duration-300 hover:bg-rose-50 rounded-full"
                                aria-label="Open search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            {/* Wishlist */}
                            <button className="hidden sm:block p-2 text-gray-500 hover:text-rose-600 transition-all duration-300 hover:bg-rose-50 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            {/* User */}
                            <button className="p-2 text-gray-500 hover:text-rose-600 transition-all duration-300 hover:bg-rose-50 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {/* Cart */}
                            <button className="p-2 text-gray-500 hover:text-rose-600 transition-all duration-300 hover:bg-rose-50 rounded-full relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* Mobile Hamburger */}
                            <button
                                className="lg:hidden p-2 text-gray-600 hover:text-rose-600 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="bg-white border-t border-gray-100 py-4 px-6 space-y-1">
                        {[...navLinks, { name: 'Sale', href: '#' }].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block text-sm font-medium uppercase tracking-wider py-3 border-b border-gray-50 last:border-0 transition-colors ${item.name === 'Sale' ? 'text-rose-600 font-bold' : 'text-gray-700 hover:text-rose-600'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Search Overlay */}
                <div
                    className={`absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for brands, products, categories..."
                            className="flex-1 text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none bg-transparent font-light tracking-wide"
                        />
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-200"
                            aria-label="Close search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
