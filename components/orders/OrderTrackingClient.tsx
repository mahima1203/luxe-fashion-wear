'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderById } from '@/api/orders';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderTrackingClient() {
    const params = useParams();
    const orderId = parseInt(params.id as string);
    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrderById(orderId),
        enabled: !isNaN(orderId)
    });

    if (isLoading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading order details...</div>;
    if (error || !order) return <div className="text-center py-20 text-rose-500">Failed to load order.</div>;

    const stages = ['pending', 'paid', 'shipped', 'delivered'];
    
    let currentStageIndex = stages.indexOf(order.status);
    if (currentStageIndex === -1 && order.status === 'confirmed') currentStageIndex = 1;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Tracking</h1>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Order #{order.id}</p>
                        <p className="text-xs text-gray-400">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                
                {/* Timeline */}
                <div className="relative mt-10 mb-10">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100 relative z-0">
                        <div style={{ width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#f60046] transition-all duration-500 relative z-10 w-0"></div>
                    </div>
                    {/* Dots and Labels */}
                    <div className="flex justify-between text-xs font-semibold text-gray-400 -mt-7">
                        {stages.map((stage, idx) => (
                            <div key={stage} className={`flex flex-col items-center flex-1 ${idx <= currentStageIndex ? 'text-[#f60046]' : ''}`}>
                                <div className={`w-4 h-4 rounded-full mb-1 z-20 ${idx <= currentStageIndex ? 'bg-[#f60046]' : 'bg-gray-200'}`}></div>
                                <span className="capitalize mt-2">{stage}</span>
                            </div>
                        ))}
                    </div>
                    {order.status === 'cancelled' && (
                        <div className="text-center text-rose-600 font-bold mt-4 uppercase tracking-widest pt-4">This order was cancelled.</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Delivery Address</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        <span className="text-gray-900 font-bold">{order.address.full_name}</span> <br/>
                        {order.address.line1} <br/>
                        {order.address.line2 && <>{order.address.line2}<br/></>}
                        {order.address.city}, {order.address.state} {order.address.pincode} <br/>
                        Phone: {order.address.phone}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Items</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex gap-4">
                                <Link href={`/product/${item.product_id}`} className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden block">
                                    {item.product_image.startsWith('http') ? (
                                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover"/>
                                    ) : (
                                        <CldImage src={item.product_image} alt={item.product_name} width={64} height={80} crop="fill" className="w-full h-full object-cover"/>
                                    )}
                                </Link>
                                <div className="flex-1">
                                    <Link href={`/product/${item.product_id}`} className="hover:underline block mt-0.5">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.product_brand}</p>
                                        <p className="text-sm text-gray-800 line-clamp-1 mt-0.5">{item.product_name}</p>
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-1.5 py-0.5 rounded">Qty: {item.quantity}</p>
                                        {item.size && <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-1.5 py-0.5 rounded">Size: {item.size}</p>}
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 border-t pt-4 flex justify-between items-center text-lg font-black text-gray-900">
                        <span>Total Paid</span>
                        <span>₹{order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="text-center pt-4">
                <Link href="/fashion-home" className="inline-block bg-white text-[#f60046] font-bold px-8 py-3 rounded border border-[#f60046] hover:bg-rose-50 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
