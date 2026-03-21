'use client';

export default function AddressesTab() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                <button className="flex items-center gap-1 text-sm font-semibold text-white bg-[#f60046] hover:bg-[#d6003c] transition-colors px-4 py-2 rounded shadow">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add New
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default Address */}
                <div className="bg-white rounded border-2 border-green-500 p-5 relative shadow-sm">
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Default
                    </div>
                    <div className="mb-3">
                        <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">Home</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Amit Kumar</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        123 Luxe Avenue, Floor 4<br />
                        Koramangala Block 5<br />
                        Bengaluru, Karnataka 560034<br />
                        India
                    </p>
                    <p className="text-sm text-gray-900 mb-4 font-medium">Mobile: <span className="text-gray-600 font-normal">+91 98765 43210</span></p>
                    
                    <div className="flex gap-4 border-t border-gray-100 pt-4">
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider">Edit</button>
                        <span className="w-px h-4 bg-gray-300 mt-0.5"></span>
                        <button className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors uppercase tracking-wider">Remove</button>
                    </div>
                </div>

                {/* Second Address */}
                <div className="bg-white rounded border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-colors relative">
                    <div className="mb-3">
                        <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">Office</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Amit Kumar</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Tech Park Main Building<br />
                        Outer Ring Road, Bellandur<br />
                        Bengaluru, Karnataka 560103<br />
                        India
                    </p>
                    <p className="text-sm text-gray-900 mb-4 font-medium">Mobile: <span className="text-gray-600 font-normal">+91 98765 43210</span></p>
                    
                    <div className="flex gap-4 border-t border-gray-100 pt-4">
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider">Edit</button>
                        <span className="w-px h-4 bg-gray-300 mt-0.5"></span>
                        <button className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors uppercase tracking-wider">Remove</button>
                        <span className="w-px h-4 bg-gray-300 mt-0.5"></span>
                        <button className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors uppercase tracking-wider">Set Default</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
