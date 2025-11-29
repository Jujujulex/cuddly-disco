'use client'

import { useState } from 'react';
import { useUser } from '@/context/UserContext';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { profile, updateProfile } = useUser();
    const [name, setName] = useState(profile?.name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({ name, bio });
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[var(--background)] rounded-2xl shadow-xl p-6 animate-scale-in">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--muted)] border-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your name"
                            maxLength={30}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--muted)] border-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                            placeholder="Tell us about yourself"
                            maxLength={160}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
