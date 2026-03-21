'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to send OTP');
            }

            setStep('OTP');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Invalid OTP');
            }

            const data = await res.json();
            // Store JWT securely in a cookie
            document.cookie = `luxe_token=${data.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;

            // Redirect back to original page
            router.push(callbackUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-gray-900 mb-2">Luxe</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        {step === 'EMAIL' ? 'Enter your email to sign in or create an account' : 'Enter the 6-digit verification code'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {step === 'EMAIL' ? (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors text-gray-900 font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-[#d6003c] hover:bg-[#b00030] text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#d6003c]/30"
                        >
                            {isLoading ? 'Sending Code...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label htmlFor="otp" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Verification Code</label>
                                <button type="button" onClick={() => setStep('EMAIL')} className="text-xs font-bold text-[#d6003c] hover:underline">
                                    Change Email
                                </button>
                            </div>
                            <input
                                id="otp"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors text-center text-2xl tracking-[0.5em] font-black text-gray-900"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-3 text-center">
                                We sent a 6-digit code to <strong className="text-gray-900">{email}</strong>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 text-center italic">
                                Note: If you have not configured SMTP credentials, check your backend server terminal right now to see the code!
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
            <FashionNavbar />
            <main className="flex-grow flex items-center justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginContent />
                </Suspense>
            </main>
            <FashionFooter />
        </div>
    );
}
