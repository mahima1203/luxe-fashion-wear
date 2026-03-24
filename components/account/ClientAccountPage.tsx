'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';
import ProfileTab from './components/ProfileTab';
import OrdersTab from './components/OrdersTab';
import AddressesTab from './components/AddressesTab';

type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'payment';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
        id: 'profile',
        label: 'My Profile',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    {
        id: 'orders',
        label: 'My Orders',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    },
    {
        id: 'wishlist',
        label: 'My Wishlist',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    },
    {
        id: 'addresses',
        label: 'Saved Addresses',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
        id: 'payment',
        label: 'Payment Methods',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    }
];

export default function ClientAccountPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get('tab') as TabType;
    
    // Default to 'profile' if invalid or missing tab
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [userInfo, setUserInfo] = useState<{ email: string; name: string; initial: string } | null>(null);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const token = getCookie('luxe_token');
        if (token) {
            try {
                // Decode JWT payload securely on client side
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decoded = JSON.parse(jsonPayload);
                if (decoded && decoded.email) {
                    const email = decoded.email;
                    const namePart = email.split('@')[0];
                    const name = namePart.split('.').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                    const initial = name.charAt(0).toUpperCase();
                    setUserInfo({ email, name, initial });
                }
            } catch (error) {
                console.error("Failed to parse token", error);
            }
        }
    }, []);

    useEffect(() => {
        if (tabParam && tabs.some(t => t.id === tabParam)) {
            if (tabParam === 'wishlist') {
                router.push('/wishlist'); // Redirect to existing functional wishlist
            } else {
                setActiveTab(tabParam);
            }
        }
    }, [tabParam, router]);

    const handleTabChange = (tabId: TabType) => {
        if(tabId === 'wishlist') {
            router.push('/wishlist');
            return;
        }
        setActiveTab(tabId);
        // Optional: Update URL without refresh
        window.history.pushState(null, '', `?tab=${tabId}`);
    };

    const handleLogout = () => {
        // Clear the token cookie
        document.cookie = 'luxe_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
        // Redirect to login
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#f9fafc] flex flex-col">
            <FashionNavbar />
            
            <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">My Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your profile, orders, and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Horizontal Scrollable Tabs on Mobile, Sidebar on Desktop */}
                    <div className="w-full lg:w-72 flex-shrink-0 bg-white shadow-sm border border-gray-100 rounded-md overflow-hidden">
                        {/* User Profile Summary */}
                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#f60046] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white uppercase">
                                {userInfo ? userInfo.initial : 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 capitalize">{userInfo ? userInfo.name : 'User'}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[150px]">{userInfo ? userInfo.email : 'Loading...'}</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide py-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center gap-4 px-6 py-4 lg:py-4 transition-colors text-left flex-shrink-0 lg:flex-shrink border-b lg:border-b-0 border-r lg:border-r-0 lg:border-l-4 border-gray-100 ${
                                        activeTab === tab.id
                                            ? 'bg-rose-50/50 text-[#f60046] lg:border-l-[#f60046] font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                                    }`}
                                >
                                    <span className={`${activeTab === tab.id ? 'text-[#f60046]' : 'text-gray-400'}`}>
                                        {tab.icon}
                                    </span>
                                    <span className="text-sm whitespace-nowrap">{tab.label}</span>
                                </button>
                            ))}
                            
                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-4 px-6 py-4 mt-auto border-t border-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left font-medium w-full"
                            >
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                <span className="text-sm whitespace-nowrap text-red-600">Logout</span>
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full min-w-0">
                        {activeTab === 'profile' && <ProfileTab userInfo={userInfo} />}
                        {activeTab === 'orders' && <OrdersTab />}
                        {activeTab === 'addresses' && <AddressesTab />}
                        {activeTab === 'payment' && (
                            <div className="bg-white rounded border border-gray-200 p-12 text-center shadow-sm">
                                <p className="text-gray-500">You haven't added any payment methods yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <FashionFooter />
        </div>
    );
}
