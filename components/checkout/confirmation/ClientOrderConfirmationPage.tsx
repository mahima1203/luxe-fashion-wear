'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchOrderById } from '@/api/orders';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';

export default function ClientOrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params?.orderId);

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrderById(orderId),
        enabled: !!orderId
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <FashionNavbar />
                <main className="flex-grow flex items-center justify-center p-8 text-gray-500 animate-pulse font-medium tracking-wide gap-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    Loading order details...
                </main>
                <FashionFooter />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <FashionNavbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed">We couldn't seem to find the order you're looking for. It might be invalid or you might not have access to it.</p>
                        <button onClick={() => router.push('/fashion-home')} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-lg transition-colors text-sm uppercase tracking-wider shadow-md">
                            Return Home
                        </button>
                    </div>
                </main>
                <FashionFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <FashionNavbar />
            
            <main className="flex-grow max-w-3xl mx-auto px-4 py-12 w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                    {/* Header Strip */}
                    <div className={`h-2 w-full ${order.status === 'paid' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}></div>
                    
                    <div className="p-8 sm:p-12 text-center border-b border-gray-100 relative overflow-hidden">
                        {/* Confetti Background pattern (subtle) */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                        
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg ${order.status === 'paid' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-yellow-100 text-yellow-600 border border-yellow-200'}`}>
                            {order.status === 'paid' ? (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3 relative z-10">
                            {order.status === 'paid' ? 'Order Confirmed!' : 'Order Placed!'}
                        </h1>
                        <p className="text-gray-500 font-medium relative z-10 text-lg">
                            Order ID: <span className="text-gray-900 tracking-widest font-bold bg-gray-100 px-3 py-1 rounded ml-1">#{order.id}</span>
                        </p>
                    </div>

                    <div className="p-8 sm:p-12">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Updates</h3>
                                <p className="text-gray-900 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    We've sent a confirmation email to you. We'll notify you when your order ships!
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Items Summary</h3>
                                <div className="space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50/50">
                                            <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                                                <img src={item.product_image.startsWith('http') ? item.product_image : `https://res.cloudinary.com/demo/image/upload/${item.product_image}`} alt={item.product_name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 truncate">{item.product_brand}</h4>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{item.product_name}</p>
                                                <p className="text-xs bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full inline-block mt-2">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-8 flex justify-between items-center bg-gray-50 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 px-8 sm:px-12 py-8 rounded-b-2xl">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount Paid</p>
                                    <p className="text-sm font-medium text-gray-600">Including shipping</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">₹{order.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 text-center space-x-4">
                    <Link href="/account?tab=orders" className="inline-block px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm tracking-wider uppercase text-sm">
                        View Order Details
                    </Link>
                    <Link href="/fashion-home" className="inline-block px-8 py-4 bg-[#f60046] text-white font-bold rounded-xl hover:bg-[#d6003c] transition-all shadow-md shadow-[#f60046]/20 tracking-wider uppercase text-sm">
                        Continue Shopping
                    </Link>
                </div>
            </main>
            
            <FashionFooter />
        </div>
    );
}
