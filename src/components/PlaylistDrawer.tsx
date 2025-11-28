'use client'

import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface PlaylistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PlaylistDrawer({ isOpen, onClose }: PlaylistDrawerProps) {
    const { queue, currentTrack, playTrack, removeFromQueue } = useAudioPlayer();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-[var(--background)] border-l border-[var(--border)] shadow-2xl animate-slide-in-right flex flex-col">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-xl font-bold gradient-text">Queue</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {queue.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                            <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <p>Queue is empty</p>
                        </div>
                    ) : (
                        queue.map((track, index) => {
                            const isCurrent = currentTrack?.tokenId === track.tokenId;
                            return (
                                <div
                                    key={`${track.tokenId}-${index}`}
                                    className={`group flex items-center gap-3 p-3 rounded-xl transition-colors ${isCurrent ? 'bg-[hsl(280,80%,60%)]/10 border border-[hsl(280,80%,60%)]/20' : 'hover:bg-[var(--muted)]'}`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative"
                                        onClick={() => playTrack(track)}
                                    >
                                        <img
                                            src={track.metadata?.image || '/placeholder-music.png'}
                                            alt={track.metadata?.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {isCurrent && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-4 h-4 bg-[hsl(280,80%,60%)] rounded-full animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => playTrack(track)}>
                                        <h4 className={`font-medium truncate ${isCurrent ? 'text-[hsl(280,80%,60%)]' : ''}`}>
                                            {track.metadata?.name}
                                        </h4>
                                        <p className="text-sm text-[var(--muted-foreground)] truncate">
                                            {track.metadata?.artist}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromQueue(track.tokenId.toString());
                                        }}
                                        className="p-2 text-[var(--muted-foreground)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
