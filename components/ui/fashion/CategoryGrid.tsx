import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        name: 'Women',
        tagline: 'Elegant & Bold',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80',
        color: 'from-rose-600/80 to-pink-900/60',
        href: '/products/women',
    },
    {
        name: 'Men',
        tagline: 'Sharp & Refined',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
        color: 'from-slate-700/80 to-gray-900/60',
        href: '/products/men',
    },
    // ... unchanged lines ...
    {
        name: 'Kids',
        tagline: 'Fun & Colorful',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80',
        color: 'from-amber-500/80 to-orange-800/60',
        href: '#',
    },
    {
        name: 'Accessories',
        tagline: 'Finish the Look',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80',
        color: 'from-violet-600/80 to-purple-900/60',
        href: '#',
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase">Explore</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2">
                        Shop by Category
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-4 rounded-full" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Image */}
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
// ... unchanged lines ...
                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                                <span className="text-white/70 text-xs font-medium tracking-[0.2em] uppercase mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    {cat.tagline}
                                </span>
                                <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-wider uppercase">
                                    {cat.name}
                                </h3>
                                <div className="mt-3 overflow-hidden">
                                    <span className="inline-flex items-center gap-1 text-white text-xs font-semibold tracking-widest uppercase bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        Shop Now
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
