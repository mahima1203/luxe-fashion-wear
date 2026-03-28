export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: 'Male' | 'Female' | 'Other';
    addresses?: Address[];
}

export interface Address {
    id: number;
    user_id: number;
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    type: string;
    is_default: boolean;
    created_at?: string;
}
