import { fetchProduct } from '@/api/products';
import { notFound } from 'next/navigation';
import ProductImageClient from '@/components/product/ProductImageClient';
import FashionNavbar from '@/components/ui/fashion/FashionNavbar';
import FashionFooter from '@/components/ui/fashion/FashionFooter';
import ProductActionsClient from '@/components/product/ProductActionsClient';
import ProductReviews from '@/components/product/ProductReviews';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await fetchProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <FashionNavbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm text-gray-500">
                    <ol className="flex items-center space-x-2">
                        <li><a href="/" className="hover:text-rose-600 transition-colors">Home</a></li>
                        <li><span>/</span></li>
                        <li><a href={`/products/${product.category.toLowerCase()}`} className="hover:text-rose-600 transition-colors capitalize">{product.category}</a></li>
                        <li><span>/</span></li>
                        <li className="text-gray-900 font-medium truncate">{product.name}</li>
                    </ol>
                </nav>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-4 max-w-6xl mx-auto">
                    
                    {/* Image Gallery Column (Left side, ~55%) */}
                    <div className="w-full md:w-[55%] flex justify-center md:justify-start">
                        <div className="w-full max-w-[480px]">
                            <ProductImageClient 
                                image={product.image} 
                                name={product.name} 
                                badge={product.badge} 
                            />
                        </div>
                    </div>

                    {/* Product Details Column (Right side, ~45%) */}
                    <div className="w-full md:w-[45%] flex flex-col pt-2">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-1">{product.brand}</h2>
                            <h1 className="text-xl font-medium text-gray-700 leading-relaxed mb-4">{product.name}</h1>
                            
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-sm font-semibold text-gray-600">MRP:</span>
                                <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice > product.price && (
                                    <>
                                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        <span className="text-sm font-bold text-emerald-600">({product.discount}% OFF)</span>
                                    </>
                                )}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">Inclusive of all taxes</p>
                            
                            {/* Dynamic rating */}
                            {product.total_reviews > 0 ? (
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                        {product.average_rating.toFixed(1)} <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 border-l border-gray-300 pl-2 tracking-wide uppercase">{product.total_reviews} Reviews</span>
                                </div>
                            ) : (
                                <div className="mt-4 text-xs font-bold text-gray-400 tracking-wide uppercase">No reviews yet</div>
                            )}
                        </div>
                        
                        {/* Tata Cliq Green Offer Banner */}
                        <div className="flex items-center justify-between py-3 px-4 bg-emerald-50/50 border border-emerald-100 rounded mb-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                <span className="text-sm text-gray-700">Get this for only <span className="text-emerald-600 font-bold">₹{Math.floor(product.price * 0.9)}</span></span>
                            </div>
                            <span className="text-sm font-bold text-rose-600 cursor-pointer">View Offers</span>
                        </div>

                        <ProductActionsClient product={product}>
                            {/* Available Offers section (mock) */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Available Offers</h3>
                                <div className="flex items-start gap-3 text-sm text-gray-700">
                                    <div className="text-amber-500 mt-0.5">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold">Flat 10% OFF.</span> Applying this coupon makes eligible products non-ret... <span className="text-blue-600 cursor-pointer">more</span>
                                    </div>
                                </div>
                            </div>
                        </ProductActionsClient>
                        
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews product={product} />
            </main>
            
            <FashionFooter />
        </div>
    );
}
