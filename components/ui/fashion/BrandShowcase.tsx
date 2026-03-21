'use client';

const brands = [
    { name: 'ZARA', letters: 'ZARA' },
    { name: 'H&M', letters: 'H&M' },
    { name: 'GUCCI', letters: 'GUCCI' },
    { name: 'NIKE', letters: 'NIKE' },
    { name: 'PRADA', letters: 'PRADA' },
    { name: 'ADIDAS', letters: 'ADIDAS' },
    { name: 'VERSACE', letters: 'VERSACE' },
    { name: 'DIOR', letters: 'DIOR' },
    { name: 'BURBERRY', letters: 'BURBERRY' },
    { name: 'ARMANI', letters: 'ARMANI' },
    { name: 'TOMMY', letters: 'TOMMY' },
    { name: 'CALVIN KLEIN', letters: 'CALVIN KLEIN' },
];

export default function BrandShowcase() {
    return (
        <section className="py-16 lg:py-24 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                {/* Section Header */}
                <div className="text-center">
                    <span className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase">Exclusive Partners</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2">
                        Shop by Brand
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-4 rounded-full" />
                    <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
                        Discover authentic products from the world&apos;s most coveted fashion houses
                    </p>
                </div>
            </div>

            {/* Scrolling Brand Grid (Marquee) */}
            <div className="relative flex overflow-x-hidden group mt-8">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-12 sm:gap-20 px-4 group-hover:[animation-play-state:paused]">
                    {/* First set of brands */}
                    {brands.map((brand) => (
                        <div
                            key={`first-${brand.name}`}
                            className="flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-default"
                        >
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.1em] text-center px-4 uppercase">
                                {brand.letters}
                            </span>
                        </div>
                    ))}
                    {/* Duplicate set for infinite loop */}
                    {brands.map((brand) => (
                        <div
                            key={`second-${brand.name}`}
                            className="flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-default"
                        >
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.1em] text-center px-4 uppercase">
                                {brand.letters}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* View All Brands */}
            <div className="text-center mt-12">
                <a
                    href="#"
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-rose-600 text-white text-sm font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Explore All 500+ Brands
                    <svg className="w-4 h-4 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>

            {/* Tailwind Keyframes for Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 35s linear infinite;
                }
            `}</style>
        </section>
    );
}
