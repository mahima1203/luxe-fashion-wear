const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const getHeaders = () => {
    if (typeof document === 'undefined') return { 'Content-Type': 'application/json' };
    const token = document.cookie.split('; ').find(row => row.startsWith('luxe_token='))?.split('=')[1];
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const hasToken = () => {
    if (typeof document === 'undefined') return false;
    return !!document.cookie.split('; ').find(row => row.startsWith('luxe_token='));
};

// ─── CART ────────────────────────────────────────────────────────────────────

export const fetchCartFromApi = async () => {
    if (!hasToken()) return [];
    const res = await fetch(`${API_URL}/api/users/cart`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
};

export const addToCartApi = async (product_id: number, quantity: number = 1) => {
    if (!hasToken()) return null;
    const res = await fetch(`${API_URL}/api/users/cart`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ product_id, quantity })
    });
    if (!res.ok) throw new Error('Failed to add to cart API');
    return res.json();
};

export const updateCartItemApi = async (item_id: number, quantity: number) => {
    if (!hasToken()) return null;
    const res = await fetch(`${API_URL}/api/users/cart/${item_id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity })
    });
    if (!res.ok) throw new Error('Failed to update cart API');
    return res.json();
};

export const removeFromCartApi = async (item_id: number) => {
    if (!hasToken()) return null;
    const res = await fetch(`${API_URL}/api/users/cart/${item_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to remove from cart API');
    return true;
};

// ─── WISHLIST ────────────────────────────────────────────────────────────────

export const fetchWishlistFromApi = async () => {
    if (!hasToken()) return [];
    const res = await fetch(`${API_URL}/api/users/wishlist`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    return res.json();
};

export const addToWishlistApi = async (product_id: number) => {
    if (!hasToken()) return null;
    const res = await fetch(`${API_URL}/api/users/wishlist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ product_id })
    });
    if (!res.ok) throw new Error('Failed to add to wishlist API');
    return res.json();
};

export const removeFromWishlistApi = async (item_id: number) => {
    if (!hasToken()) return null;
    const res = await fetch(`${API_URL}/api/users/wishlist/${item_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to remove from wishlist API');
    return true;
};
