'use client';

import { useState, useEffect } from 'react';

const deals = [
    {
        title: 'Designer Dresses',
        subtitle: 'Starting at',
        price: '₹1,499',
        discount: '70% OFF',
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
        emoji: '👗',
    },
    {
        title: 'Premium Sneakers',
        subtitle: 'Starting at',
        price: '₹2,999',
        discount: '60% OFF',
        gradient: 'from-violet-500 via-purple-500 to-indigo-500',
        emoji: '👟',
    },
    {
        title: 'Luxury Watches',
        subtitle: 'Starting at',
        price: '₹4,999',
        discount: '55% OFF',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        emoji: '⌚',
    },
    {
        title: 'Handbags & Clutches',
        subtitle: 'Starting at',
        price: '₹999',
        discount: '65% OFF',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        emoji: '👜',
    },
];

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 45, seconds: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                seconds -= 1;
                if (seconds < 0) {
                    seconds = 59;
                    minutes -= 1;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours -= 1;
                }
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-1.5">
            {[
                { label: 'HRS', value: pad(timeLeft.hours) },
                { label: 'MIN', value: pad(timeLeft.minutes) },
                { label: 'SEC', value: pad(timeLeft.seconds) },
            ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-1.5">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[48px]">
                        <div className="text-white text-xl sm:text-2xl font-black font-mono leading-none">{item.value}</div>
                        <div className="text-white/60 text-[8px] font-bold tracking-widest mt-1">{item.label}</div>
                    </div>
                    {i < 2 && <span className="text-white/50 text-xl font-bold">:</span>}
                </div>
            ))}
        </div>
    );
}

export default function DealsSection() {
    return (
        <section className="py-16 lg:py-24 bg-gray-900 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
                    <div>
                        <span className="text-rose-400 text-sm font-semibold tracking-[0.3em] uppercase">Limited Time</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2">
                            Deals of the{' '}
                            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Day</span>
                        </h2>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <p className="text-gray-400 text-xs font-medium tracking-wider uppercase mb-2">Ends in</p>
                        <CountdownTimer />
                    </div>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {deals.map((deal) => (
                        <a
                            key={deal.title}
                            href="#"
                            className="group relative rounded-2xl overflow-hidden cursor-pointer"
                        >
                            {/* Gradient BG */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${deal.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />

                            {/* Pattern overlay */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            </div>

                            <div className="relative p-6 sm:p-8 text-center">
                                {/* Emoji / Icon */}
                                <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    {deal.emoji}
                                </div>

                                {/* Discount */}
                                <div className="bg-white/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full mb-3">
                                    <span className="text-white text-xs sm:text-sm font-black tracking-wide">{deal.discount}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-white text-sm sm:text-base font-bold mb-1">{deal.title}</h3>

                                {/* Price */}
                                <p className="text-white/70 text-xs">{deal.subtitle}</p>
                                <p className="text-white text-xl sm:text-2xl font-black">{deal.price}</p>

                                {/* CTA */}
                                <div className="mt-4 overflow-hidden">
                                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
