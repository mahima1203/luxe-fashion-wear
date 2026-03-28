export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    product_brand: string;
    product_image: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    user_id: number;
    address_snapshot: string;
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    created_at: string;
    items?: OrderItem[];
}
