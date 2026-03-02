import { Metadata } from 'next';
import FashionNavbar from '@/app/ui/fashion/FashionNavbar';
import HeroBanner from '@/app/ui/fashion/HeroBanner';
import CategoryGrid from '@/app/ui/fashion/CategoryGrid';
import TrendingProducts from '@/app/ui/fashion/TrendingProducts';
import DealsSection from '@/app/ui/fashion/DealsSection';
import BrandShowcase from '@/app/ui/fashion/BrandShowcase';
import Newsletter from '@/app/ui/fashion/Newsletter';
import FashionFooter from '@/app/ui/fashion/FashionFooter';

export const metadata: Metadata = {
    title: 'LUXE Fashion | Premium Fashion & Lifestyle Store',
    description:
        'Discover the latest trends from 500+ premium fashion brands. Shop designer clothing, shoes, accessories & more with up to 60% off.',
};

export default function FashionHomePage() {
    return (
        <main className="min-h-screen bg-white">
            <FashionNavbar />
            <HeroBanner />
            <CategoryGrid />
            <TrendingProducts />
            <DealsSection />
            <BrandShowcase />
            <Newsletter />
            <FashionFooter />
        </main>
    );
}
