'use client';

import { useCartStore, getLineItemId } from '@/app/store/cartStore';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';

export default function ClientCartPage() {
    const cartItems = useCartStore((state) => state.cartItems);
    const selectedIds = useCartStore((state) => state.selectedIds);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const toggleSelect = useCartStore((state) => state.toggleSelect);
    const setAllSelected = useCartStore((state) => state.setAllSelected);
    const router = useRouter();

    const selectedItems = cartItems.filter(item => selectedIds.includes(getLineItemId(item.id, item.size)));
    const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalMRP = selectedItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const discountTotal = totalMRP - subtotal;
    const shipping = subtotal > 999 ? 0 : (subtotal > 0 ? 99 : 0);
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <FashionNavbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Shopping Bag 
                        <span className="text-base font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                        </span>
                    </h1>
                    
                    {cartItems.length > 0 && (
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-gray-300 text-[#f60046] focus:ring-[#f60046]"
                                checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                                onChange={(e) => setAllSelected(e.target.checked)}
                            />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                Select All ({selectedIds.length}/{cartItems.length})
                            </span>
                        </label>
                    )}
                </div>
                
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded shadow-sm border border-gray-100">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <h2 className="text-xl font-medium text-gray-800 mb-2">Your bag is empty</h2>
                        <p className="text-gray-500 mb-6 text-center max-w-md">Looks like you haven't added anything to your bag yet. Discover the latest trends and styles.</p>
                        <Link href="/fashion-home" className="bg-[#d6003c] text-white px-8 py-3 rounded font-medium hover:bg-[#b00030] transition-colors shadow">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-4">
                            {cartItems.map((item) => {
                                const lineId = getLineItemId(item.id, item.size);
                                return (
                                <div key={lineId} className={`bg-white p-4 rounded border transition-all flex gap-4 sm:gap-6 relative group ${selectedIds.includes(lineId) ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>
                                    {/* Selection Checkbox */}
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-gray-300 text-[#f60046] focus:ring-[#f60046] cursor-pointer"
                                            checked={selectedIds.includes(lineId)}
                                            onChange={() => toggleSelect(lineId)}
                                        />
                                    </div>
                                    <Link href={`/product/${item.id}`} className="w-24 h-32 sm:w-32 sm:h-40 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                        <CldImage 
                                            src={item.image} 
                                            alt={item.name} 
                                            width={128} 
                                            height={160} 
                                            crop="fill" 
                                            className="object-cover w-full h-full" 
                                        />
                                    </Link>
                                    
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start pr-6 sm:pr-0">
                                            <div>
                                                <Link href={`/product/${item.id}`} className="hover:underline">
                                                    <h3 className="text-sm font-bold text-gray-900">{item.brand}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 pr-4">{item.name}</p>
                                                </Link>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <div className="text-base font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                                                {item.originalPrice > item.price && (
                                                    <div className="text-xs text-gray-400 line-through mt-0.5">₹{(item.originalPrice * item.quantity).toLocaleString()}</div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {item.size && <div className="text-sm text-gray-500 mt-2 mb-auto">Size: <span className="text-gray-900 font-medium">{item.size}</span></div>}
                                        
                                        <div className="flex items-center gap-4 mt-4">
                                            {/* Quantity Control */}
                                            <div className="flex items-center border border-gray-300 rounded h-9">
                                                <button 
                                                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                >
                                                    <span className="text-lg leading-none mb-0.5">-</span>
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                                                <button 
                                                    className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                >
                                                    <span className="text-lg leading-none mb-0.5">+</span>
                                                </button>
                                            </div>
                                            
                                            <button 
                                                onClick={() => removeFromCart(item.id, item.size)}
                                                className="text-sm font-medium text-gray-500 hover:text-rose-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        
                                        {/* Mobile Price Display */}
                                        <div className="mt-3 sm:hidden">
                                            <div className="text-base font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                                            {item.originalPrice > item.price && (
                                                <div className="text-xs text-gray-400 line-through">₹{(item.originalPrice * item.quantity).toLocaleString()}</div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Remove X */}
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="sm:hidden absolute top-2 right-2 p-2 text-gray-400 hover:text-rose-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                )})}
                        </div>
                        
                        {/* Order Summary */}
                        <div className="w-full lg:w-1/3 bg-white p-6 rounded border border-gray-200 sticky top-24 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-100 pb-4">Order Summary</h2>
                            
                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Total MRP</span>
                                    <span>₹{totalMRP.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount on MRP</span>
                                    <span>-₹{discountTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Tax</span>
                                    <span>Inclusive</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-3">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-emerald-600 uppercase font-medium" : ""}>
                                        {shipping === 0 ? "Free" : `₹${shipping}`}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                                    <span>Total Amount</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    const hasToken = document.cookie.includes('luxe_token');
                                    if (hasToken) {
                                        router.push('/checkout');
                                    } else {
                                        router.push('/login?callbackUrl=/checkout');
                                    }
                                }}
                                className={`w-full font-bold py-3.5 px-6 rounded transition-colors text-sm uppercase tracking-wider shadow-md mb-4 ${
                                    selectedIds.length > 0 
                                    ? 'bg-[#f60046] hover:bg-[#d6003c] text-white' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                disabled={selectedIds.length === 0}
                            >
                                Proceed to Checkout ({selectedIds.length})
                            </button>
                            
                            {/* Trust badges */}
                            <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    100% Secure
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Easy Returns
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <FashionFooter />
        </div>
    );
}
