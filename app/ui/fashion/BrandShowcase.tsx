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
    { name: 'CALVIN KLEIN', letters: 'CK' },
];

export default function BrandShowcase() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase">Exclusive Partners</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2">
                        Shop by Brand
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-4 rounded-full" />
                    <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
                        Discover authentic products from the world&apos;s most coveted fashion houses
                    </p>
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {brands.map((brand) => (
                        <a
                            key={brand.name}
                            href="#"
                            className="group flex items-center justify-center aspect-[4/3] rounded-2xl border-2 border-gray-100 bg-gray-50/50 hover:border-rose-200 hover:bg-rose-50/50 hover:shadow-lg transition-all duration-500 px-4"
                        >
                            <span className="text-lg sm:text-xl lg:text-2xl font-black tracking-[0.15em] text-gray-300 group-hover:text-gray-900 transition-colors duration-500 text-center">
                                {brand.letters}
                            </span>
                        </a>
                    ))}
                </div>

                {/* View All Brands */}
                <div className="text-center mt-10">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-rose-600 text-white text-sm font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Explore All 500+ Brands
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
