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
    id: string;
    label: string; // 'Home', 'Office', etc.
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
