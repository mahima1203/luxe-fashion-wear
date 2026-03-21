'use client';

export default function ProfileTab() {
    return (
        <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <button className="text-sm font-semibold text-[#f60046] hover:text-[#d6003c] transition-colors">
                    Edit
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Full Name</p>
                    <p className="text-base text-gray-900 font-medium">Amit Kumar</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Email Address</p>
                    <p className="text-base text-gray-900 font-medium">amit.kumar@example.com</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Phone Number</p>
                    <p className="text-base text-gray-900 font-medium">+91 98765 43210</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Gender</p>
                    <p className="text-base text-gray-900 font-medium">Male</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors text-sm">
                        Change Password
                    </button>
                    <button className="px-6 py-2.5 border border-[#f60046] text-[#f60046] font-medium rounded hover:bg-rose-50 transition-colors text-sm">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
