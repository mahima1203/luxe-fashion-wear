import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';

interface DummyPaymentGatewayProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (paymentId: string, signature: string) => void;
    amount: number;
    email: string;
    phone: string;
}

export default function DummyPaymentGateway({
    isOpen,
    onClose,
    onSuccess,
    amount,
    email,
    phone
}: DummyPaymentGatewayProps) {
    const [method, setMethod] = useState<'upi' | 'card'>('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Card Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setIsProcessing(false);
            setMethod('upi');
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleProcessPayment = () => {
        if (method === 'card') {
            if (cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3 || name.length < 3) {
                alert('Please fill out all card details completely.');
                return;
            }
        }
        
        setIsProcessing(true);
        
        // Simulate network delay and processing (2.5 seconds)
        setTimeout(() => {
            setIsProcessing(false);
            // Generate dummy Razorpay-like IDs
            const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 12)}`;
            const mockSignature = `sig_mock_${Math.random().toString(36).substring(2, 15)}`;
            
            onSuccess(mockPaymentId, mockSignature);
        }, 2500);
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
        setCardNumber(val);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setExpiry(val);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="bg-[#121212] px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-[0.2em]">LUXE</span>
                        <span className="text-[9px] font-light text-gray-400 tracking-widest uppercase mt-1 border-l border-gray-600 pl-2">Secure Pay</span>
                    </div>
                    {!isProcessing && (
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {isProcessing ? (
                    <div className="flex flex-col items-center justify-center p-12 flex-grow min-h-[400px]">
                        <div className="w-16 h-16 border-4 border-gray-100 border-t-[#f60046] rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                        <p className="text-sm text-gray-500 text-center animate-pulse">
                            Please wait while we securely process your payment. Do not close this window or press back.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col flex-grow overflow-y-auto">
                        
                        {/* Transaction Summary Info */}
                        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-500">Amount to Pay</span>
                                <span className="text-2xl font-black text-gray-900">₹{amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {email} • {phone}
                            </div>
                        </div>

                        {/* Payment Methods Tabs */}
                        <div className="flex border-b border-gray-100">
                            <button 
                                onClick={() => setMethod('upi')}
                                className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${method === 'upi' ? 'text-[#f60046] border-b-2 border-[#f60046] bg-rose-50/30' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                UPI / QR
                            </button>
                            <button 
                                onClick={() => setMethod('card')}
                                className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${method === 'card' ? 'text-[#f60046] border-b-2 border-[#f60046] bg-rose-50/30' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                Card
                            </button>
                        </div>

                        {/* Payment Method Content */}
                        <div className="p-6">
                            {method === 'upi' && (
                                <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300">
                                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                                        {/* Mock QR Code Pattern using SVG */}
                                        <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-90">
                                            <rect width="160" height="160" fill="#ffffff" />
                                            {/* Corner squares */}
                                            <path d="M10,10 h40 v40 h-40 z M20,20 h20 v20 h-20 z" fill="#000" />
                                            <path d="M110,10 h40 v40 h-40 z M120,20 h20 v20 h-20 z" fill="#000" />
                                            <path d="M10,110 h40 v40 h-40 z M20,120 h20 v20 h-20 z" fill="#000" />
                                            {/* Random looking blocks for QR effect */}
                                            <rect x="65" y="10" width="10" height="10" fill="#000" />
                                            <rect x="80" y="25" width="20" height="10" fill="#000" />
                                            <rect x="10" y="65" width="30" height="10" fill="#000" />
                                            <rect x="50" y="60" width="60" height="30" fill="#000" />
                                            <rect x="120" y="70" width="30" height="20" fill="#000" />
                                            <rect x="65" y="110" width="20" height="40" fill="#000" />
                                            <rect x="100" y="110" width="40" height="10" fill="#000" />
                                            <rect x="95" y="130" width="20" height="20" fill="#000" />
                                            <rect x="135" y="130" width="15" height="15" fill="#000" />
                                            {/* Decorative Luxe icon in middle */}
                                            <rect x="68" y="68" width="24" height="24" fill="#fff" rx="4"/>
                                            <path d="M74,84 L80,74 L86,84 Z" fill="#f60046" />
                                        </svg>
                                    </div>
                                    <h4 className="text-gray-900 font-bold mb-2">Scan QR Code</h4>
                                    <p className="text-sm text-gray-500 mb-6">Open any UPI app like Google Pay, PhonePe, Paytm or BHIM to scan and pay.</p>
                                    
                                    <button 
                                        onClick={handleProcessPayment}
                                        className="w-full bg-[#f60046] hover:bg-[#d6003c] text-white font-bold py-3.5 rounded-lg transition-colors uppercase tracking-widest text-sm shadow-lg shadow-rose-500/30"
                                    >
                                        Simulate UPI Payment
                                    </button>
                                </div>
                            )}

                            {method === 'card' && (
                                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                                    {/* Mock Card UI */}
                                    <div className="w-full h-40 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white relative flex flex-col justify-between overflow-hidden shadow-lg border border-gray-700">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/20 rounded-full blur-xl pointer-events-none"></div>
                                        
                                        <div className="flex justify-between items-start relative z-10">
                                            <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            <span className="text-xs font-medium tracking-widest uppercase opacity-80">Credit Card</span>
                                        </div>
                                        <div className="text-lg tracking-[0.2em] font-medium relative z-10 mb-2">
                                            {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ').trim() : '#### #### #### ####'}
                                        </div>
                                        <div className="flex justify-between items-end relative z-10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-widest opacity-60">Card Holder</span>
                                                <span className="text-sm font-semibold tracking-wider font-sans uppercase">
                                                    {name || 'YOUR NAME'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] uppercase tracking-widest opacity-60">Expires</span>
                                                <span className="text-sm font-semibold tracking-wider font-sans">
                                                    {expiry || 'MM/YY'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <div className="space-y-3 pt-2">
                                        <input 
                                            type="text" 
                                            placeholder="Card Number" 
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f60046] focus:border-transparent transition-all"
                                        />
                                        <div className="flex gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                value={expiry}
                                                onChange={handleExpiryChange}
                                                className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f60046] focus:border-transparent transition-all"
                                            />
                                            <input 
                                                type="password" 
                                                placeholder="CVV" 
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                                className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f60046] focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Name on Card" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value.toUpperCase())}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f60046] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <button 
                                        onClick={handleProcessPayment}
                                        className="w-full bg-[#f60046] hover:bg-[#d6003c] text-white font-bold py-3.5 mt-2 rounded-lg transition-colors uppercase tracking-widest text-sm shadow-lg shadow-rose-500/30"
                                    >
                                        Pay ₹{amount.toLocaleString()}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer info */}
                        <div className="mt-auto px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            100% Encrypted Payment Simulation
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
