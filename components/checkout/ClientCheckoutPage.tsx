'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { fetchAddresses } from '@/api/addresses';
import { createOrderFromCart } from '@/api/orders';
import { createRazorpayOrder, verifyPayment } from '@/api/payments';
import { useCartStore } from '@/app/store/cartStore';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';
import AddressFormModal from '@/components/account/components/AddressFormModal';
import { createAddress } from '@/api/addresses';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export default function ClientCheckoutPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const cartItems = useCartStore((state) => state.cartItems);
    const selectedIds = useCartStore((state) => state.selectedIds);
    const cartCount = useCartStore((state) => state.cartCount);

    // Only process items that were selected in the bag
    const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
    const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
    
    const [isOrderCompleted, setIsOrderCompleted] = useState(false);
    
    // Check auth and cart immediately
    useEffect(() => {
        const hasToken = document.cookie.includes('luxe_token');
        if (!hasToken) {
            router.push('/login?callbackUrl=/checkout');
        } else if ((cartCount === 0 || selectedIds.length === 0) && !isOrderCompleted) {
            router.push('/cart');
        }
    }, [cartCount, selectedIds, router, isOrderCompleted]);

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    const { data: addresses, isLoading: loadingAddresses } = useQuery({
        queryKey: ['addresses'],
        queryFn: fetchAddresses
    });

    // Auto-select top/default address if none selected
    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedAddressId) {
            const defAddr = addresses.find(a => a.is_default);
            setSelectedAddressId(defAddr ? defAddr.id : addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const addAddressMutation = useMutation({
        mutationFn: createAddress,
        onSuccess: (newAddr) => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setSelectedAddressId(newAddr.id);
            setIsAddressModalOpen(false);
            toast.success('Address added and selected!');
        },
        onError: () => toast.error('Failed to add address')
    });

    const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalMRP = selectedItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const discountTotal = totalMRP - subtotal;
    const shipping = subtotal > 999 ? 0 : (subtotal > 0 ? 99 : 0);
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error('Please select a delivery address');
            return;
        }

        setIsCreatingOrder(true);
        const toastId = toast.loading('Initiating secure payment...');
        
        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?', { id: toastId });
                return;
            }

            // Construct payload according to backend schema
            // Construct payload according to backend schema (ONLY SELECTED ITEMS)
            const orderItems = selectedItems.map(item => ({
                product_id: Number(item.id),
                product_name: item.name,
                product_brand: item.brand,
                product_image: item.image,
                price: item.price,
                quantity: item.quantity
            }));

            // 1. Create Internal Order
            const order = await createOrderFromCart(selectedAddressId, orderItems);
            
            // 2. Create Razorpay Order
            const rzOrder = await createRazorpayOrder(order.id);
            
            toast.dismiss(toastId);
            
            // 3. Open Razorpay Checkout Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: rzOrder.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: rzOrder.currency,
                name: "Luxe Fashion",
                description: "Purchase from Luxe Fashion",
                image: "https://next-learn-dashboard.vercel.sh/favicon.ico",
                order_id: rzOrder.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response: any) {
                    await handlePaymentSuccess(
                        order.id,
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature
                    );
                },
                prefill: {
                    name: addresses?.find(a => a.id === selectedAddressId)?.full_name || "Luxe User",
                    email: "user@luxee.com",
                    contact: addresses?.find(a => a.id === selectedAddressId)?.phone || ''
                },
                theme: {
                    color: "#f60046"
                }
            };
            
            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            paymentObject.open();
            
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during checkout', { id: toastId });
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const handlePaymentSuccess = async (internalOrderId: number, rzOrderId: string, paymentId: string, signature: string) => {
        const toastId = toast.loading('Verifying secure payment...');
        
        try {
            await verifyPayment(
                internalOrderId, 
                rzOrderId, 
                paymentId, 
                signature
            );
            toast.success('Payment Verified & Successful!', { id: toastId });
            // Mark order as complete so the safety-check effect doesn't redirect to /cart
            setIsOrderCompleted(true);
            
            // Sync Cart from DB upon success (removes ordered items, keeps others if any)
            await useCartStore.getState().syncFromApi();

            // Invalidate orders query so the list is fresh when we redirect
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            router.refresh();
            
            // Update the existing toast to show success and redirection
            toast.success('Payment Successful! Redirecting to your Orders...', { id: toastId });
            
            setTimeout(() => {
                router.push('/account?tab=orders');
            }, 1200);
            
        } catch (error) {
            toast.error('Payment verification failed on the server.', { id: toastId });
        }
    };

    if (cartCount === 0) return null; // Will redirect

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <FashionNavbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Checkout</h1>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column: Delivery Address */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">1</span>
                                    Delivery Address
                                </h2>
                                <button onClick={() => setIsAddressModalOpen(true)} className="text-sm font-semibold text-[#f60046] hover:underline">
                                    + Add New Address
                                </button>
                            </div>
                            
                            {loadingAddresses ? (
                                <div className="p-4 text-center text-gray-500 animate-pulse">Loading addresses...</div>
                            ) : !addresses || addresses.length === 0 ? (
                                <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-gray-500 mb-4">No delivery address found.</p>
                                    <button onClick={() => setIsAddressModalOpen(true)} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium shadow-md">Add an Address</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <div 
                                            key={address.id} 
                                            onClick={() => setSelectedAddressId(address.id)}
                                            className={`cursor-pointer rounded-lg p-4 border-2 transition-all relative ${
                                                selectedAddressId === address.id ? 'border-[#f60046] bg-rose-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {selectedAddressId === address.id && (
                                                <div className="absolute top-4 right-4 text-[#f60046]">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-gray-900">{address.full_name}</h3>
                                                <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{address.type}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                {address.line1}<br />
                                                {address.line2 && <>{address.line2}<br /></>}
                                                {address.city}, {address.state} {address.pincode}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">Phone: {address.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">2</span>
                                Order Summary
                            </h2>
                            
                            <div className="max-h-60 overflow-y-auto pr-2 mb-6 space-y-4">
                                {selectedItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 relative">
                                            <img 
                                                src={item.image.startsWith('http') ? item.image : `https://res.cloudinary.com/demo/image/upload/${item.image}`} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover rounded" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.brand}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{item.name}</p>
                                            <p className="text-xs font-semibold mt-1 text-gray-700">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Total MRP ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})</span>
                                    <span>₹{totalMRP.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span>-₹{discountTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-4">
                                    <span>Delivery Fee</span>
                                    <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                                        {shipping === 0 ? "Free" : `₹${shipping}`}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
                                    <span>Total Amount</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isCreatingOrder || !selectedAddressId}
                                className="w-full bg-[#f60046] hover:bg-[#d6003c] text-white font-bold py-4 px-6 rounded-lg transition-transform hover:scale-[1.02] active:scale-95 text-base uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {isCreatingOrder ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Pay Now'
                                )}
                            </button>
                            
                            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                                By clicking Pay Now, you securely agree to Luxee's Terms of Use & Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            
            <AddressFormModal 
                isOpen={isAddressModalOpen} 
                onClose={() => setIsAddressModalOpen(false)} 
                onSave={(addr) => addAddressMutation.mutate(addr)} 
            />
            
            <FashionFooter />
        </div>
    );
}
