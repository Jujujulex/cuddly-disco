'use client'

import { useParams, useRouter } from 'next/navigation';
import { usePlaylists } from '@/context/PlaylistContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import NFTCard from '@/components/NFTCard';
import { useState } from 'react';

export default function PlaylistDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const playlistId = params.id as string;
    const { getPlaylist, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();
    const { playTrack, addToQueue } = useAudioPlayer();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const playlist = getPlaylist(playlistId);

    if (!playlist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Playlist Not Found</h1>
                    <button
                        onClick={() => router.push('/profile')}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    const handlePlayAll = () => {
        if (playlist.tracks.length > 0) {
            playTrack(playlist.tracks[0]);
            playlist.tracks.slice(1).forEach(track => addToQueue(track));
        }
    };

    const handleDeletePlaylist = () => {
        deletePlaylist(playlistId);
        router.push('/profile');
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,70%,50%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-10 blur-3xl"></div>

            <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-start gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    <div className="flex-1">
                        <h1 className="text-4xl font-bold gradient-text mb-2">{playlist.name}</h1>
                        {playlist.description && (
                            <p className="text-[var(--muted-foreground)] mb-4">{playlist.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                            <span>{playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {playlist.tracks.length > 0 && (
                            <button
                                onClick={handlePlayAll}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Play All
                            </button>
                        )}
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-3 rounded-full border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            Delete Playlist
                        </button>
                    </div>
                </div>

                {/* Tracks */}
                {playlist.tracks.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Tracks Yet</h3>
                        <p className="text-[var(--muted-foreground)] mb-6">
                            Add tracks to this playlist from the explore or profile pages
                        </p>
                        <button
                            onClick={() => router.push('/explore')}
                            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift"
                        >
                            Explore Music
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {playlist.tracks.map((track) => (
                            <div key={track.tokenId.toString()} className="relative group">
                                <NFTCard tokenData={track} chainId={11155111} />
                                <button
                                    onClick={() => removeTrackFromPlaylist(playlistId, track.tokenId.toString())}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    title="Remove from playlist"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="glass rounded-2xl p-6 max-w-md w-full space-y-6">
                        <h2 className="text-2xl font-bold">Delete Playlist?</h2>
                        <p className="text-[var(--muted-foreground)]">
                            Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePlaylist}
                                className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
