'use client';

import { useQuery } from '@tanstack/react-query';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { fetchOrders } from '@/api/orders';

export default function OrdersTab() {
    const { data: rawOrders, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders
    });

    // Filter out 'pending' orders so users don't see dropped carts as placed orders
    const orders = rawOrders?.filter(o => o.status !== 'pending') || [];

    if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading orders...</div>;
    if (error) return <div className="p-8 text-center text-rose-500 bg-rose-50 rounded-lg">Failed to load orders.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order History ({orders.length})</h2>
            
            {orders.length === 0 ? (
                <div className="bg-white rounded border border-gray-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No orders placed yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase yet.</p>
                    <Link href="/fashion-home" className="inline-block bg-[#f60046] hover:bg-[#d6003c] text-white font-medium px-8 py-3 rounded transition-colors shadow">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-wrap gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Order Placed</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Order ID</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">#{order.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    order.status === 'paid' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                }`}>
                                    {order.status}
                                </span>
                                <Link 
                                    href={`/order-tracking/${order.id}`} 
                                    className="text-sm font-semibold text-[#f60046] hover:underline bg-rose-50 px-3 py-1 rounded border border-rose-100 transition-colors hover:bg-rose-100"
                                >
                                    Track Order
                                </Link>
                            </div>
                        </div>
                        
                        <div className="p-6 divide-y divide-gray-100">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex gap-4 sm:gap-6 items-center py-4 first:pt-0 last:pb-0">
                                    <Link href={`/product/${item.product_id}`} className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative border border-gray-200 block transition-transform hover:scale-105">
                                        {item.product_image.startsWith('http') ? (
                                            <img src={item.product_image} alt={item.product_name} className="object-cover w-full h-full" />
                                        ) : (
                                            <CldImage 
                                                src={item.product_image} 
                                                alt={item.product_name} 
                                                width={80} 
                                                height={96} 
                                                crop="fill" 
                                                className="object-cover w-full h-full" 
                                            />
                                        )}
                                    </Link>
                                    <div className="flex-1">
                                        <Link href={`/product/${item.product_id}`} className="hover:underline block">
                                            <h4 className="text-sm font-bold text-gray-900">{item.product_brand}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{item.product_name}</p>
                                        </Link>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">Qty: {item.quantity}</p>
                                                {item.size && <p className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">Size: {item.size}</p>}
                                            </div>
                                            <p className="text-xs font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
