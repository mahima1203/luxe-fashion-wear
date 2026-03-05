'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const banners = [
    {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
        alt: 'Summer Collection - Women shopping fashion',
        badge: 'New Season 2026',
        heading: ['THE', 'SUMMER', 'COLLECTION'],
        headingGradient: 'from-rose-300 via-pink-300 to-fuchsia-300',
        subtext: 'Discover curated styles from',
        highlight: '500+ premium brands',
        subtextEnd: '. Up to 60% off on your favorites.',
        cta1: 'Shop Now',
        cta2: 'Explore Brands',
    },
    {
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
        alt: 'Streetwear Collection - Urban fashion editorial',
        badge: 'Trending Now',
        heading: ['BOLD', 'STREET', 'STYLE'],
        headingGradient: 'from-amber-300 via-orange-300 to-yellow-300',
        subtext: 'Unleash your edge with',
        highlight: 'exclusive streetwear drops',
        subtextEnd: '. Limited editions, unlimited attitude.',
        cta1: 'Shop Streetwear',
        cta2: 'View Lookbook',
    },
    {
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
        alt: 'Accessories Collection - Luxury handbags and accessories',
        badge: 'Just Arrived',
        heading: ['LUXURY', 'ACCES', 'SORIES'],
        headingGradient: 'from-emerald-300 via-teal-300 to-cyan-300',
        subtext: 'Elevate every outfit with',
        highlight: 'designer accessories',
        subtextEnd: '. Bags, jewelry, scarves & more.',
        cta1: 'Shop Accessories',
        cta2: 'Gift Guide',
    },
    {
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80',
        alt: 'Activewear Collection - Athletic fashion model',
        badge: 'Fit & Fab',
        heading: ['ACTIVE', 'WEAR', 'EDIT'],
        headingGradient: 'from-violet-300 via-purple-300 to-indigo-300',
        subtext: 'Performance meets fashion.',
        highlight: 'Gym-to-street looks',
        subtextEnd: ' you\'ll love. Comfort redefined.',
        cta1: 'Shop Activewear',
        cta2: 'New Arrivals',
    },
    {
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80',
        alt: 'Evening Wear Collection - Elegant formal fashion',
        badge: 'Black Tie Edit',
        heading: ['EVENING', 'GLAM', 'OUR'],
        headingGradient: 'from-yellow-200 via-amber-200 to-orange-200',
        subtext: 'Make every entrance unforgettable.',
        highlight: 'Gowns, suits & statement pieces',
        subtextEnd: ' for every occasion.',
        cta1: 'Shop Evening Wear',
        cta2: 'Style Inspiration',
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goTo = useCallback(
        (index: number) => {
            if (isTransitioning) return;
            setIsTransitioning(true);
            setCurrent(index);
            setTimeout(() => setIsTransitioning(false), 700);
        },
        [isTransitioning],
    );

    const next = useCallback(() => goTo((current + 1) % banners.length), [current, goTo]);
    const prev = useCallback(() => goTo((current - 1 + banners.length) % banners.length), [current, goTo]);

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const b = banners[current];

    return (
        <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden">
            {/* Background Images */}
            {banners.map((banner, i) => (
                <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                >
                    <Image
                        src={banner.image}
                        alt={banner.alt}
                        fill
                        className="object-cover object-center"
                        priority={i === 0}
                        sizes="100vw"
                    />
                </div>
            ))}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-[2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-[2]" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl">
                        {/* Badge */}
                        <div
                            key={`badge-${current}`}
                            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-[fadeInUp_0.6s_ease-out_both]"
                        >
                            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                            <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wider uppercase">
                                {b.badge}
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            key={`heading-${current}`}
                            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.95] mb-4 animate-[fadeInUp_0.6s_ease-out_0.1s_both]"
                        >
                            {b.heading[0]}
                            <br />
                            <span
                                className={`bg-gradient-to-r ${b.headingGradient} bg-clip-text text-transparent`}
                            >
                                {b.heading[1]}
                            </span>
                            <br />
                            {b.heading[2]}
                        </h1>

                        {/* Subtext */}
                        <p
                            key={`sub-${current}`}
                            className="text-white/80 text-base sm:text-lg lg:text-xl font-light mb-8 max-w-md leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.2s_both]"
                        >
                            {b.subtext}{' '}
                            <span className="text-rose-300 font-medium">{b.highlight}</span>
                            {b.subtextEnd}
                        </p>

                        {/* CTAs */}
                        <div
                            key={`cta-${current}`}
                            className="flex flex-wrap gap-4 animate-[fadeInUp_0.6s_ease-out_0.3s_both]"
                        >
                            <a
                                href="#"
                                className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all duration-300 rounded-full shadow-2xl"
                            >
                                {b.cta1}
                                <svg
                                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 text-sm font-medium uppercase tracking-widest hover:bg-white/10 hover:border-white/70 transition-all duration-300 rounded-full backdrop-blur-sm"
                            >
                                {b.cta2}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                aria-label="Previous banner"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all duration-300 group"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                aria-label="Next banner"
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all duration-300 group"
            >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`transition-all duration-500 rounded-full ${i === current
                            ? 'w-8 h-2.5 bg-white shadow-lg shadow-white/30'
                            : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>



            {/* CSS Keyframes */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
}
