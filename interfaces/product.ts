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
    average_rating: number;
    total_reviews: number;
}

export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user_full_name: string | null;
}
