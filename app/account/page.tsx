import { Suspense } from 'react';
import ClientAccountPage from '@/components/account/ClientAccountPage';

export const metadata = {
    title: 'My Account - Luxe Fashion',
    description: 'Manage your profile, orders, and settings.',
};

export default function AccountPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account...</div>}>
            <ClientAccountPage />
        </Suspense>
    );
}
