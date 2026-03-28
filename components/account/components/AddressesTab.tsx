'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchAddresses, createAddress, updateAddress, deleteAddress } from '@/api/addresses';
import type { Address } from '@/interfaces/customer';
import AddressFormModal from './AddressFormModal';

export default function AddressesTab() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const { data: addresses, isLoading, error } = useQuery({
        queryKey: ['addresses'],
        queryFn: fetchAddresses
    });

    const createMutation = useMutation({
        mutationFn: createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Address added successfully');
            setIsModalOpen(false);
        },
        onError: () => toast.error('Failed to add address')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<Address> }) => updateAddress(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Address updated successfully');
            setIsModalOpen(false);
        },
        onError: () => toast.error('Failed to update address')
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            toast.success('Address deleted successfully');
        },
        onError: () => toast.error('Failed to delete address')
    });

    const handleSave = (addressData: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
        if (editingAddress) {
            updateMutation.mutate({ id: editingAddress.id, data: addressData });
        } else {
            createMutation.mutate(addressData);
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSetDefault = (address: Address) => {
        updateMutation.mutate({ id: address.id, data: { is_default: true } });
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading addresses...</div>;
    if (error) return <div className="p-8 text-center text-rose-500 bg-rose-50 rounded-lg">Failed to load addresses.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Saved Addresses ({addresses?.length || 0})</h2>
                <button onClick={handleAddNew} className="flex items-center gap-1 text-sm font-semibold text-white bg-[#f60046] hover:bg-[#d6003c] transition-colors px-4 py-2 rounded shadow">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add New
                </button>
            </div>
            
            <AddressFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                initialData={editingAddress} 
            />

            {!addresses || addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-gray-200 border-dashed rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h3 className="text-gray-900 font-bold mb-1">No addresses saved</h3>
                    <p className="text-gray-500 text-sm mb-4">Add a delivery address to complete your profile.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id} className={`bg-white rounded p-5 relative shadow-sm transition-colors ${address.is_default ? 'border-2 border-green-500' : 'border border-gray-200 hover:border-gray-300'}`}>
                            {address.is_default && (
                                <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Default
                                </div>
                            )}
                            <div className="mb-3">
                                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">{address.type}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-base mb-1">{address.full_name}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                {address.line1}<br />
                                {address.line2 && <>{address.line2}<br /></>}
                                {address.city}, {address.state} {address.pincode}<br />
                                India
                            </p>
                            <p className="text-sm text-gray-900 mb-4 font-medium">Mobile: <span className="text-gray-600 font-normal">{address.phone}</span></p>
                            
                            <div className="flex gap-4 border-t border-gray-100 pt-4">
                                <button onClick={() => handleEdit(address)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider disabled:opacity-50">Edit</button>
                                <span className="w-px h-4 bg-gray-300 mt-0.5"></span>
                                <button onClick={() => handleDelete(address.id)} className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors uppercase tracking-wider disabled:opacity-50">Remove</button>
                                {!address.is_default && (
                                    <>
                                        <span className="w-px h-4 bg-gray-300 mt-0.5"></span>
                                        <button onClick={() => handleSetDefault(address)} className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors uppercase tracking-wider disabled:opacity-50">Set Default</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
