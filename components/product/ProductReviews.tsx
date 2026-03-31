'use client';

import { useState, useEffect } from 'react';
import { Review, Product } from '@/interfaces/product';
import { fetchReviews, checkReviewEligibility } from '@/api/products';
import { toast } from 'sonner';

interface ProductReviewsProps {
    product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [eligibilityMessage, setEligibilityMessage] = useState("");

    useEffect(() => {
        async function loadReviews() {
            setLoading(true);
            const data = await fetchReviews(product.id);
            setReviews(data);
            
            // Check eligibility if user is logged in
            const token = document.cookie.split('; ').find(row => row.startsWith('luxe_token='))?.split('=')[1];
            if (token) {
                const eligibility = await checkReviewEligibility(product.id, token);
                setCanReview(eligibility.can_review);
                setEligibilityMessage(eligibility.message);
            }
            setLoading(false);
        }
        loadReviews();
    }, [product.id]);

    const handleWriteReview = () => {
        if (!canReview) {
            toast.error(eligibilityMessage || "You are not eligible to review this product yet.");
            return;
        }
        // Redirect to a review page or open a modal (for now just a toast)
        toast.info("Review form coming soon! Use Swagger for now.");
    };

    if (loading) return <div className="py-10 text-center text-gray-500">Loading reviews...</div>;

    return (
        <section className="mt-16 border-t border-gray-200 pt-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg 
                                    key={star} 
                                    className={`w-5 h-5 ${star <= Math.round(product.average_rating) ? 'text-amber-400' : 'text-gray-200'}`} 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">Based on {product.total_reviews} reviews</span>
                    </div>
                </div>
                
                {canReview && (
                    <button 
                        onClick={handleWriteReview}
                        className="px-6 py-2.5 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded hover:bg-gray-900 hover:text-white transition-all text-sm uppercase tracking-wider"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-10 text-center">
                    <p className="text-gray-500 mb-2">No reviews yet for this product.</p>
                    <p className="text-xs text-gray-400">Be the first to share your thoughts after your order is delivered!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm transition-hover hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900">{review.user_full_name || "Luxe Customer"}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Verified Buyer • {new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    {review.rating} ★
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                "{review.comment || "Great product!"}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
