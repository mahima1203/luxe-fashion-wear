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
