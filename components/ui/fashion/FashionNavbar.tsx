'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchResults } from '@/api/search';
import type { Product } from '@/interfaces/product';
import { useCartStore } from '@/app/store/cartStore';

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
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);

    // Authentication disabled per user request
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const router = useRouter();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const desktopSearchInputRef = useRef<HTMLInputElement>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Store State
    const cartCount = useCartStore((state) => state.cartCount);
    const wishlistCount = useCartStore((state) => state.wishlistCount);

    // ... Effects ...
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setShowDropdown(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (query.trim().length === 0) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowDropdown(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await getSearchResults(query);
                setSearchResults(results);
            } catch (error) {
                console.error("Search failed", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (desktopSearchInputRef.current && !desktopSearchInputRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const SearchDropdown = () => {
        if (!showDropdown || searchQuery.trim() === '') return null;

        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {isSearching ? (
                    <div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        Searching for "{searchQuery}"...
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="flex flex-col">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Products
                        </div>
                        {searchResults.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                onClick={() => {
                                    setShowDropdown(false);
                                    setIsSearchOpen(false);
                                }}
                            >
                                <div className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <CldImage
                                        src={product.image}
                                        alt={product.name}
                                        width={48}
                                        height={64}
                                        crop="fill"
                                        className="object-cover w-full h-full"
                                        sizes="48px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">{product.brand}</h4>
                                    <p className="text-xs text-gray-500 truncate">{product.name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                                    <div className="text-xs text-gray-400 line-through">₹{product.originalPrice}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 mb-2">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-medium text-sm">No results found</p>
                        <p className="text-gray-500 text-xs mt-1">Try checking your spelling or searching for a broader term like "men" or "shoes".</p>
                    </div>
                )}
            </div>
        );
    };

    const handleProtectedAction = (action: string) => {
        if (action === 'cart') {
            router.push('/cart');
        } else if (action === 'wishlist') {
            router.push('/wishlist');
        } else {
            console.log(`Action allowed: ${action}`);
        }
    };


    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white text-center py-2.5 text-xs sm:text-sm font-medium tracking-wider">
                <span className="inline-flex items-center gap-2">
                    ✨ FREE SHIPPING on orders above ₹999 &nbsp;|&nbsp; Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">STYLE50</span> for 20% off ✨
                </span>
            </div>

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-[#121212] backdrop-blur-xl border-b border-gray-800 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20 gap-4 lg:gap-8">
                        {/* Logo */}
                        <Link href="/fashion-home" className="flex items-center gap-1">
                            <span className="text-2xl lg:text-3xl font-black tracking-[0.25em] text-white">
                                LUXE
                            </span>
                            <span className="text-[10px] font-light text-gray-400 tracking-widest -ml-0.5 mt-2">FASHION</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative text-sm font-semibold text-white hover:text-gray-300 transition-colors flex items-center gap-1 group"
                                >
                                    {item.name}
                                    <svg className="w-4 h-4 text-white transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>

                        {/* TATA CLiQ Style Search Bar (Desktop) */}
                        <div className="hidden lg:flex flex-1 max-w-2xl relative" ref={desktopSearchInputRef}>
                            <div className="flex items-center w-full bg-[#3d3d3d] rounded-md overflow-hidden hover:bg-[#4d4d4d] transition-colors group focus-within:ring-1 focus-within:ring-gray-400 focus-within:bg-[#4d4d4d]">
                                <div className="px-3 text-gray-400 group-hover:text-gray-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for Brands, Men, Women..."
                                    className="w-full py-2.5 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => { if (searchQuery.trim().length > 0) setShowDropdown(true); }}
                                />
                                {searchQuery.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSearchResults([]);
                                            setShowDropdown(false);
                                            // Optional: keep focus on input
                                            const input = desktopSearchInputRef.current?.querySelector('input');
                                            if (input) input.focus();
                                        }}
                                        className="px-2 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <svg className="w-4 h-4 bg-gray-600/50 hover:bg-gray-500 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                                <button className="px-4 text-gray-400 hover:text-white transition-colors" aria-label="Voice search">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            </div>
                            <SearchDropdown />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                            {/* Mobile Search Icon */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="lg:hidden p-1 text-white hover:text-gray-300 transition-colors"
                                aria-label="Open search"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Notifications */}
                            <button className="hidden sm:block p-1 text-white hover:text-gray-300 transition-colors relative">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
                            </button>

                            {/* Account / Login Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setShowAccountDropdown(true)}
                                onMouseLeave={() => setShowAccountDropdown(false)}
                            >
                                <button
                                    className="p-1 text-white hover:text-gray-300 transition-colors relative flex items-center"
                                    aria-label="Account"
                                >
                                    <svg className={`w-6 h-6 ${isLoggedIn ? 'text-green-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                {/* Dropdown menu */}
                                <div className={`absolute top-full right-[-80px] sm:right-[-40px] mt-4 w-60 bg-white rounded-md shadow-2xl border border-gray-100 z-50 py-4 px-4 transition-all duration-200 origin-top transform ${showAccountDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                    {/* Caret pointing up */}
                                    <div className="absolute -top-2 right-[88px] sm:right-[48px] w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                                    {/* Login / Register Button */}
                                    {!isLoggedIn && (
                                        <div className="mb-4 relative z-10">
                                            <button
                                                onClick={() => { setIsLoggedIn(true); setShowAccountDropdown(false); }}
                                                className="w-full bg-[#f60046] hover:bg-[#d6003c] text-white font-semibold py-2.5 rounded-full transition-colors text-sm"
                                            >
                                                Login/ Register
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-1 relative z-10">
                                        <Link href="/account?tab=profile" className="flex items-center gap-4 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-gray-800 hover:text-[#f60046] group">
                                            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0 group-hover:border-[#f60046]">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <span className="text-[15px] font-medium">My Account</span>
                                        </Link>
                                        <Link href="/account?tab=orders" className="flex items-center gap-4 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-gray-800 hover:text-[#f60046]">
                                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            <span className="text-[15px] font-medium">Order History</span>
                                        </Link>
                                        <Link href="/wishlist" className="flex items-center gap-4 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-gray-800 hover:text-[#f60046]">
                                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            <span className="text-[15px] font-medium">My Wishlist</span>
                                        </Link>
                                        <Link href="/account?tab=payment" className="flex items-center gap-4 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-gray-800 hover:text-[#f60046]">
                                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            <span className="text-[15px] font-medium">Payment Options</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-4 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-gray-800 hover:text-[#f60046]">
                                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                                            <span className="text-[15px] font-medium">Gift Card</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-4 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-gray-800 hover:text-[#f60046]">
                                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="text-[15px] font-medium">LUXE Cash</span>
                                        </Link>
                                        {isLoggedIn && (
                                            <button
                                                onClick={() => { setIsLoggedIn(false); setShowAccountDropdown(false); }}
                                                className="flex items-center gap-4 px-2 py-2 mt-2 hover:bg-gray-50 rounded-md transition-colors text-red-600 w-full text-left"
                                            >
                                                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                <span className="text-[15px] font-medium">Logout</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Wishlist */}
                            <button
                                onClick={() => handleProtectedAction('wishlist')}
                                className="hidden sm:block p-1 text-white hover:text-gray-300 transition-colors relative"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {isLoggedIn && wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-in zoom-in">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart */}
                            <button
                                onClick={() => handleProtectedAction('cart')}
                                className="p-1 text-white hover:text-gray-300 transition-colors relative"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {isLoggedIn && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Hamburger */}
                            <button
                                className="lg:hidden p-1 text-white hover:text-gray-300 transition-colors"
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
                    <div className="bg-[#1a1a1a] border-t border-gray-800 py-4 px-6 space-y-1">
                        {[...navLinks, { name: 'Sale', href: '#' }].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block text-sm font-medium uppercase tracking-wider py-3 border-b border-gray-800 last:border-0 transition-colors ${item.name === 'Sale' ? 'text-rose-500 font-bold' : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Search Overlay (Mobile only now) */}
                <div
                    className={`absolute top-full left-0 w-full bg-[#1a1a1a] shadow-xl border-t border-gray-800 transition-all duration-300 ease-in-out overflow-hidden lg:hidden ${isSearchOpen ? 'max-h-min opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3 relative">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search for brands, products..."
                                className="flex-1 text-sm text-white placeholder-gray-500 outline-none bg-transparent font-light"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => { if (searchQuery.trim().length > 0) setShowDropdown(true); }}
                            />
                            {searchQuery.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchResults([]);
                                        setShowDropdown(false);
                                        if (searchInputRef.current) searchInputRef.current.focus();
                                    }}
                                    className="px-2 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-5 h-5 bg-gray-700/50 hover:bg-gray-600 rounded-full p-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={() => { setIsSearchOpen(false); setShowDropdown(false); setSearchQuery(''); }}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors ml-1"
                                aria-label="Cancel search"
                            >
                                Cancel
                            </button>
                        </div>
                        <SearchDropdown />
                    </div>
                </div>
            </nav>
        </>
    );
}
