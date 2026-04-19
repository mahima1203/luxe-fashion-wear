import OrderTrackingClient from '@/components/orders/OrderTrackingClient';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';

export default function OrderTrackingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <FashionNavbar />
            <main className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
                <OrderTrackingClient />
            </main>
            <FashionFooter />
        </div>
    );
}
