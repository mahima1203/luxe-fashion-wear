import type { Order } from '../interfaces/order';

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

export const fetchOrders = async (): Promise<Order[]> => {
    const res = await fetch(`${API_URL}/api/orders/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};

export const fetchOrderById = async (id: number): Promise<Order> => {
    const res = await fetch(`${API_URL}/api/orders/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
};

export interface OrderItemPayload {
    product_id: number;
    product_name: string;
    product_brand: string;
    product_image: string;
    price: number;
    quantity: number;
}

export const createOrderFromCart = async (address_id: number, items: OrderItemPayload[]): Promise<Order> => {
    const res = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ address_id, items })
    });
    if (!res.ok) {
        const data = await res.json();
        const errorMessage = Array.isArray(data.detail) 
            ? data.detail.map((err: any) => err.msg).join(', ') 
            : data.detail || 'Failed to create order';
        throw new Error(errorMessage);
    }
    return res.json();
};
