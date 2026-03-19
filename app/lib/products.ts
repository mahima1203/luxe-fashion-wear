export interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    badge?: 'New' | 'Bestseller' | 'Trending' | null;
    category: 'men' | 'women';
    subcategory: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchProducts(category: string, page: number = 1, limit: number = 10) {
    try {
        console.log(`Fetching from: ${API_BASE_URL}/api/products?category=${category}&page=${page}&limit=${limit}`);
        const response = await fetch(`${API_BASE_URL}/api/products?category=${category}&page=${page}&limit=${limit}`, {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
            products: data.products as Product[],
            hasMore: data.hasMore as boolean,
            total: data.total as number,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
            hasMore: false,
            total: 0
        };
    }
}

export async function searchProducts(query: string, limit: number = 5) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to search products: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data as Product[];
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}
