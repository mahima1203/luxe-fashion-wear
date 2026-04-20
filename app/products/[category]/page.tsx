'use client';

import { useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ui/fashion/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/fashion/ProductSkeleton';
import { fetchProducts } from '@/api/products';
import type { Product } from '@/interfaces/product';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';

export default function ProductListingPage() {
    const { category } = useParams();
    const observer = useRef<IntersectionObserver | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['products', category],
        queryFn: ({ pageParam = 1 }) => fetchProducts(category as string, pageParam),
        getNextPageParam: (lastPage: any, allPages: any[]) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const products = data ? data.pages.flatMap((page: any) => page.products as Product[]) : [];

    // Filter out unique products manually in case of duplicate keys in Strict Mode
    const uniqueProducts = Array.from(new Map(products.map((p: Product) => [p.id, p])).values()) as Product[];

    const lastProductElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isLoading || isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
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
                    {uniqueProducts.map((product: Product, index: number) => {
                        if (uniqueProducts.length === index + 1) {
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

                {(isLoading || isFetchingNextPage) && (
                    <div className="mt-8">
                        <ProductGridSkeleton count={4} />
                    </div>
                )}

                {!hasNextPage && products.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 font-medium">You&apos;ve seen it all! 🎉</p>
                    </div>
                )}

                {!isLoading && products.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-gray-500 text-lg">No products found for this category.</p>
                    </div>
                )}
            </main>
            <FashionFooter />
        </div>
    );
}
