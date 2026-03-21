'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

interface ProductImageClientProps {
    image: string;
    name: string;
    badge?: string | null;
}

export default function ProductImageClient({ image, name, badge }: ProductImageClientProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-start w-full relative">
            {/* Base Image Container */}
            <div
                className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group transition-transform duration-300 shadow-sm border border-gray-100"
                onClick={() => setIsLightboxOpen(true)}
                title="Click to enlarge"
            >
                <CldImage
                    src={image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />

                {/* Badge */}
                {badge && (
                    <span
                        className={`absolute top-4 left-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${badge === 'New'
                            ? 'bg-emerald-500 text-white'
                            : badge === 'Bestseller'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-500 text-white'
                            }`}
                    >
                        {badge}
                    </span>
                )}

                {/* Expand Icon */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-4 tracking-[0.2em] uppercase font-bold text-center flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                Click image to expand viewport
            </p>

            {/* Lightbox Modal (Tata CLIQ Style) */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 sm:p-8 md:p-12 animate-in fade-in zoom-in duration-300 backdrop-blur-sm"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Modal Container */}
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl flex max-w-[1000px] w-full h-[85vh] sm:h-[80vh] p-4 sm:p-6 sm:gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tata CLIQ style Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxOpen(false);
                            }}
                            className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-[#555555] hover:bg-[#333333] text-white rounded-xl flex items-center justify-center transition-colors z-[110] shadow-lg focus:outline-none"
                            aria-label="Close fullscreen view"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Thumbnails Sidebar - Desktop */}
                        {/* <div className="hidden sm:flex w-24 flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <button 
                                    key={index}
                                    className={`relative aspect-[3/4] w-full rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${index === 1 ? 'border-gray-900 border-[3px]' : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <CldImage
                                        src={image}
                                        alt={`${name} thumbnail ${index}`}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                        quality={60}
                                    />
                                </button>
                            ))}
                        </div> */}

                        {/* Main Modal Image Area */}
                        <div className="flex-1 relative bg-[#f7f7f7] rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-[90%] md:h-[95%] text-center flex justify-center">
                                <CldImage
                                    src={image}
                                    alt={name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1000px) 100vw, 800px"
                                    priority
                                />
                            </div>

                            {/* Left Navigation Arrow */}
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white text-gray-800 shadow-md rounded flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-gray-300">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Right Navigation Arrow */}
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white text-gray-800 shadow-md rounded flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-gray-300">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
