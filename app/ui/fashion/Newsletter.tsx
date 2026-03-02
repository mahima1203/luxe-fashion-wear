'use client';

import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <section className="relative py-20 lg:py-28 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700" />

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full" />

            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                    Join the <span className="italic">Style</span> Club
                </h2>
                <p className="text-white/80 text-base sm:text-lg mt-4 max-w-lg mx-auto leading-relaxed">
                    Get exclusive early access to sales, new arrivals, and personalized style recommendations delivered to your inbox.
                </p>

                {/* Form */}
                {subscribed ? (
                    <div className="mt-8 bg-white/15 backdrop-blur-sm rounded-2xl p-6 inline-flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold">Welcome to the club! Check your inbox 💌</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder-white/50 rounded-full px-6 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-rose-600 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/50 text-xs">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        No spam, ever
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Unsubscribe anytime
                    </span>
                    <span>Join 500K+ members</span>
                </div>
            </div>
        </section>
    );
}
