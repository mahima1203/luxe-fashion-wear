'use client';

import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

// Mock order data
const mockOrders = [
    {
        id: 'OD1029384756',
        date: 'March 15, 2026',
        status: 'Delivered',
        total: 4599,
        items: [
            {
                name: 'Men Solid Slim Fit Casual Shirt',
                brand: 'Polo Ralph Lauren',
                image: 'luxe/products/men_shirt_1_abc',
                qty: 1
            }
        ]
    },
    {
        id: 'OD9876543210',
        date: 'February 28, 2026',
        status: 'Cancelled',
        total: 12999,
        items: [
            {
                name: 'Men Slim Fit Checked Suit',
                brand: 'Armani Exchange',
                image: 'luxe/products/men_suit_1_xy',
                qty: 1
            }
        ]
    }
];

export default function OrdersTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
            
            {mockOrders.length === 0 ? (
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
                mockOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-wrap gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Order Placed</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Order ID</p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{order.id}</p>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-[#f60046] hover:text-[#d6003c] transition-colors border border-gray-200 bg-white px-4 py-1.5 rounded shadow-sm hover:shadow">
                                View Details
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 sm:gap-6 items-center">
                                    <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative border border-gray-100">
                                        <CldImage 
                                            src={item.image} 
                                            alt={item.name} 
                                            width={80} 
                                            height={96} 
                                            crop="fill" 
                                            className="object-cover w-full h-full" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-900">{item.brand}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                                        <p className="text-xs text-gray-500 mt-2">Qty: {item.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
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
