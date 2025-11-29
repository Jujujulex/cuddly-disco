'use client'

import { useState } from 'react';
import { usePlaylists } from '@/context/PlaylistContext';
import type { TokenData } from '@/types/metadata';

interface AddToPlaylistMenuProps {
    track: TokenData;
    onClose: () => void;
}

export default function AddToPlaylistMenu({ track, onClose }: AddToPlaylistMenuProps) {
    const { playlists, addTrackToPlaylist, createPlaylist } = usePlaylists();
    const [showCreateNew, setShowCreateNew] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [addedToPlaylists, setAddedToPlaylists] = useState<Set<string>>(new Set());

    const handleAddToPlaylist = (playlistId: string) => {
        addTrackToPlaylist(playlistId, track);
        setAddedToPlaylists(prev => new Set(prev).add(playlistId));

        // Auto-close after a short delay
        setTimeout(() => {
            onClose();
        }, 500);
    };

    const handleCreateAndAdd = () => {
        if (!newPlaylistName.trim()) return;

        createPlaylist(newPlaylistName.trim());
        setNewPlaylistName('');
        setShowCreateNew(false);

        // Find the newly created playlist and add the track
        // Since we just created it, it should be the last one
        setTimeout(() => {
            const newPlaylist = playlists[playlists.length - 1];
            if (newPlaylist) {
                addTrackToPlaylist(newPlaylist.id, track);
            }
            onClose();
        }, 100);
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-64 glass rounded-xl p-2 shadow-xl z-50 animate-scale-in">
            <div className="space-y-1">
                {playlists.length === 0 && !showCreateNew ? (
                    <div className="px-3 py-4 text-center text-sm text-[var(--muted-foreground)]">
                        No playlists yet
                    </div>
                ) : (
                    playlists.map((playlist) => {
                        const isAdded = addedToPlaylists.has(playlist.id);
                        const trackExists = playlist.tracks.some(
                            t => t.tokenId.toString() === track.tokenId.toString()
                        );

                        return (
                            <button
                                key={playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id)}
                                disabled={trackExists || isAdded}
                                className="w-full px-3 py-2 rounded-lg text-left hover:bg-[var(--muted)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{playlist.name}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                        {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                {(trackExists || isAdded) && (
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })
                )}

                {showCreateNew ? (
                    <div className="p-2 space-y-2 border-t border-[var(--border)] mt-2 pt-2">
                        <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            placeholder="Playlist name..."
                            maxLength={50}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreateAndAdd();
                                } else if (e.key === 'Escape') {
                                    setShowCreateNew(false);
                                    setNewPlaylistName('');
                                }
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:border-[hsl(280,80%,60%)] focus:outline-none text-sm"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowCreateNew(false);
                                    setNewPlaylistName('');
                                }}
                                className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAndAdd}
                                disabled={!newPlaylistName.trim()}
                                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-[hsl(280,80%,60%)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowCreateNew(true)}
                        className="w-full px-3 py-2 rounded-lg text-left hover:bg-[var(--muted)] transition-colors flex items-center gap-2 text-[hsl(280,80%,60%)] font-medium border-t border-[var(--border)] mt-2 pt-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Playlist
                    </button>
                )}
            </div>
        </div>
    );
}
