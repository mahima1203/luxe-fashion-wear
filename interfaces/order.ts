export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    product_brand: string;
    product_image: string;
    price: number;
    quantity: number;
    size?: string;
}

export interface OrderAddress {
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
}

export interface Order {
    id: number;
    user_id: number;
    address: OrderAddress;
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed';
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    created_at: string;
    items?: OrderItem[];
}
