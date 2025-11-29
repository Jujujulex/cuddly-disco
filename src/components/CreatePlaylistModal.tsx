'use client'

import { useState } from 'react';
import { usePlaylists } from '@/context/PlaylistContext';

interface CreatePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePlaylistModal({ isOpen, onClose }: CreatePlaylistModalProps) {
    const { createPlaylist } = usePlaylists();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            createPlaylist(name.trim(), description.trim() || undefined);
            setName('');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Error creating playlist:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            setName('');
            setDescription('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass rounded-2xl p-6 max-w-md w-full space-y-6 animate-scale-in">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold gradient-text">Create Playlist</h2>
                    <button
                        onClick={handleClose}
                        disabled={isSaving}
                        className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="playlist-name" className="block text-sm font-medium mb-2">
                            Playlist Name *
                        </label>
                        <input
                            id="playlist-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Playlist"
                            maxLength={50}
                            required
                            disabled={isSaving}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-[hsl(280,80%,60%)] focus:outline-none transition-colors disabled:opacity-50"
                        />
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            {name.length}/50 characters
                        </p>
                    </div>

                    <div>
                        <label htmlFor="playlist-description" className="block text-sm font-medium mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            id="playlist-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A collection of my favorite tracks..."
                            maxLength={200}
                            rows={3}
                            disabled={isSaving}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-[hsl(280,80%,60%)] focus:outline-none transition-colors resize-none disabled:opacity-50"
                        />
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            {description.length}/200 characters
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || isSaving}
                            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Creating...' : 'Create Playlist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
