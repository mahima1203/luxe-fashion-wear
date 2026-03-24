'use client';

import { useState, useEffect } from 'react';
import { useRouter }
    from 'next/navigation';
import { Input, CustomSelect, Button } from '@/components/ui/FormControls';

type ProfileTabProps = {
    userInfo: { email: string; name: string; initial: string } | null;
};

type FullProfile = {
    full_name: string | null;
    phone_number: string | null;
    gender: string | null;
    email: string;
};

export default function ProfileTab({ userInfo }: ProfileTabProps) {
    const [profile, setProfile] = useState<FullProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', phone_number: '', gender: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const fetchProfile = async () => {
        const token = getCookie('luxe_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setEditForm({
                    full_name: data.full_name || '',
                    phone_number: data.phone_number || '',
                    gender: data.gender || ''
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        const token = getCookie('luxe_token');
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setIsEditing(false);
            } else {
                alert("Failed to save profile.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        const token = getCookie('luxe_token');
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                document.cookie = 'luxe_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
                alert("Account deleted.");
                router.push('/');
            } else {
                alert("Failed to delete account.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const displayName = profile?.full_name || userInfo?.name || '';
    const displayEmail = profile?.email || userInfo?.email || '';

    const handleEnterEdit = () => {
        setIsEditing(true);
        if (!editForm.full_name) {
            setEditForm(prev => ({ ...prev, full_name: displayName }));
        }
    };

    return (
        <div className="bg-white rounded border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                    <button
                        onClick={handleEnterEdit}
                        className="text-sm font-semibold text-[#f60046] hover:text-[#d6003c] transition-colors uppercase tracking-widest cursor-pointer"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" onClick={() => !isEditing && handleEnterEdit()}>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                    <Input
                        type="text"
                        value={isEditing ? editForm.full_name : displayName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder={isEditing ? "Enter your full name" : ""}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50 border-transparent cursor-pointer" : "bg-white"}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <Input
                        type="email"
                        value={displayEmail}
                        readOnly
                        className="bg-gray-100 opacity-70 cursor-not-allowed border-transparent"
                    />
                    {isEditing && <p className="text-[10px] text-gray-400 mt-1 italic">Email cannot be changed.</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                    <Input
                        type="tel"
                        value={isEditing ? editForm.phone_number : (profile?.phone_number || '')}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                        placeholder={isEditing ? "+1 234 567 8900" : ""}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50 border-transparent cursor-pointer" : "bg-white"}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                    {isEditing ? (
                        <CustomSelect
                            value={editForm.gender}
                            onChange={(val) => setEditForm({ ...editForm, gender: val })}
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                                { label: 'Other', value: 'Other' },
                                { label: 'Prefer not to say', value: 'Prefer not to say' }
                            ]}
                            className="bg-white"
                            placeholder="Select gender"
                        />
                    ) : (
                        <Input
                            type="text"
                            value={profile?.gender || ''}
                            readOnly
                            placeholder=""
                            className="bg-gray-50 border-transparent cursor-pointer"
                        />
                    )}
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Account Security</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
