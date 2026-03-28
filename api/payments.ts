const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const getAuthToken = () => {
    if (typeof document === 'undefined') return null;
    return document.cookie.split('; ').find(row => row.startsWith('luxe_token='))?.split('=')[1];
};

const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export interface RazorpayOrderResponse {
    id: string; // The Razorpay order ID (returned as 'id' by Razorpay & the mock backend)
    amount: number;
    currency: string;
}

export const createRazorpayOrder = async (order_id: number): Promise<RazorpayOrderResponse> => {
    const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ order_id })
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create payment order');
    }
    return res.json();
};

export const verifyPayment = async (
    order_id: number,
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
): Promise<any> => {
    const res = await fetch(`${API_URL}/api/payments/verify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature })
    });
    if (!res.ok) {
        const data = await res.json();
        const errorMessage = Array.isArray(data.detail)
            ? data.detail.map((err: any) => err.msg).join(', ')
            : data.detail || 'Payment verification failed';
        throw new Error(errorMessage);
    }
    return res.json();
};
