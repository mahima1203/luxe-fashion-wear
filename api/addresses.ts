import type { Address } from '../interfaces/customer';

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

export const fetchAddresses = async (): Promise<Address[]> => {
    const res = await fetch(`${API_URL}/api/addresses`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch addresses');
    return res.json();
};

export const createAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> => {
    const res = await fetch(`${API_URL}/api/addresses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(address)
    });
    if (!res.ok) throw new Error('Failed to create address');
    return res.json();
};

export const updateAddress = async (id: number, address: Partial<Address>): Promise<Address> => {
    const res = await fetch(`${API_URL}/api/addresses/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(address)
    });
    if (!res.ok) throw new Error('Failed to update address');
    return res.json();
};

export const deleteAddress = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/addresses/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete address');
};
