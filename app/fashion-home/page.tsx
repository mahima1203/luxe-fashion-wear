import { Metadata } from 'next';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import HeroBanner from '@/components/ui/fashion/HeroBanner';
import CategoryGrid from '@/components/ui/fashion/CategoryGrid';
import TrendingProducts from '@/components/ui/fashion/TrendingProducts';
import DealsSection from '@/components/ui/fashion/DealsSection';
import BrandShowcase from '@/components/ui/fashion/BrandShowcase';
import Newsletter from '@/components/ui/fashion/Newsletter';
import FashionFooter from '@/components/ui/fashion/FashionFooter';

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
