'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/app/ui/fashion/ProductCard';
import { ProductGridSkeleton } from '@/app/ui/fashion/ProductSkeleton';
import { fetchProducts, Product } from '@/app/lib/products';
import FashionNavbar from '@/app/ui/fashion/FashionNavbar';
import FashionFooter from '@/app/ui/fashion/FashionFooter';

export default function ProductListingPage() {
    const { category } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreProducts = useCallback(async () => {
        if (!hasMore || (loading && page > 1)) return;

        setLoading(true);
        try {
            const data = await fetchProducts(category as string, page);
            setProducts((prev) => [...prev, ...data.products]);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }, [category, page, hasMore, loading]);

    useEffect(() => {
        loadMoreProducts();
    }, [page]);

    const lastProductElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="min-h-screen bg-white">
            <FashionNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12">
                    <span className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase">Collection</span>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mt-2 capitalize">{category}</h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mt-4 rounded-full" />
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product, index) => {
                        if (products.length === index + 1) {
                            return (
                                <div ref={lastProductElementRef} key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            );
                        } else {
                            return <ProductCard key={product.id} product={product} />;
                        }
                    })}
                </div>

                {loading && (
                    <div className="mt-8">
                        <ProductGridSkeleton count={4} />
                    </div>
                )}

                {!hasMore && products.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 font-medium">You&apos;ve seen it all! 🎉</p>
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-gray-500 text-lg">No products found for this category.</p>
                    </div>
                )}
            </main>
            <FashionFooter />
        </div>
    );
}
