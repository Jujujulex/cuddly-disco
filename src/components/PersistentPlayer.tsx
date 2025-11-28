'use client'

import { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export default function PersistentPlayer() {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        nextTrack,
        previousTrack,
        volume,
        setVolume,
        progress,
        duration,
        seek,
        isShuffle,
        toggleShuffle,
        isRepeat,
        toggleRepeat
    } = useAudioPlayer();

    const [isExpanded, setIsExpanded] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    if (!currentTrack) return null;

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seek(percent * duration);
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${isExpanded ? 'h-full md:h-24' : 'h-24'}`}>
            {/* Expanded View Overlay (Mobile) */}
            {isExpanded && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl md:hidden flex flex-col items-center justify-center p-8 space-y-8 animate-fade-in">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-4 left-4 p-2 text-white/70"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={currentTrack.metadata?.image || '/placeholder-music.png'}
                            alt={currentTrack.metadata?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-white">{currentTrack.metadata?.name}</h2>
                        <p className="text-lg text-white/70">{currentTrack.metadata?.artist}</p>
                    </div>

                    {/* Mobile Controls */}
                    <div className="w-full space-y-6">
                        <div className="flex items-center justify-between text-sm text-white/50">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <div
                            className="h-1 bg-white/20 rounded-full relative cursor-pointer"
                            onClick={handleSeek}
                            ref={progressBarRef}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-[hsl(280,80%,60%)] rounded-full"
                                style={{ width: `${(progress / duration) * 100}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-8">
                            <button onClick={previousTrack}>
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                </svg>
                            </button>
                            <button
                                onClick={togglePlay}
                                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                {isPlaying ? (
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <button onClick={nextTrack}>
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mini Player Bar (Always Visible) */}
            <div className={`absolute bottom-0 left-0 right-0 h-24 glass border-t border-[var(--border)] flex items-center justify-between px-4 md:px-8 ${isExpanded ? 'hidden md:flex' : 'flex'}`}>
                {/* Track Info */}
                <div
                    className="flex items-center gap-4 w-1/3 cursor-pointer md:cursor-default"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="w-14 h-14 rounded-lg overflow-hidden relative group">
                        <img
                            src={currentTrack.metadata?.image || '/placeholder-music.png'}
                            alt={currentTrack.metadata?.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center md:hidden">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <h3 className="font-bold text-sm truncate">{currentTrack.metadata?.name}</h3>
                        <p className="text-xs text-[var(--muted-foreground)] truncate">{currentTrack.metadata?.artist}</p>
                    </div>
                    <div className="md:hidden">
                        <h3 className="font-bold text-sm truncate max-w-[120px]">{currentTrack.metadata?.name}</h3>
                        <p className="text-xs text-[var(--muted-foreground)] truncate max-w-[120px]">{currentTrack.metadata?.artist}</p>
                    </div>
                </div>

                {/* Controls (Desktop) */}
                <div className="hidden md:flex flex-col items-center w-1/3 space-y-2">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleShuffle}
                            className={`text-[var(--muted-foreground)] hover:text-[var(--foreground)] ${isShuffle ? 'text-[hsl(280,80%,60%)]' : ''}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button onClick={previousTrack} className="hover:text-[hsl(280,80%,60%)] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                            </svg>
                        </button>
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <button onClick={nextTrack} className="hover:text-[hsl(280,80%,60%)] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                            </svg>
                        </button>
                        <button
                            onClick={toggleRepeat}
                            className={`text-[var(--muted-foreground)] hover:text-[var(--foreground)] ${isRepeat ? 'text-[hsl(280,80%,60%)]' : ''}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-full flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span>{formatTime(progress)}</span>
                        <div
                            className="flex-1 h-1 bg-[var(--muted)] rounded-full relative cursor-pointer group"
                            onClick={handleSeek}
                            ref={progressBarRef}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-[hsl(280,80%,60%)] rounded-full group-hover:bg-[hsl(280,80%,70%)] transition-colors"
                                style={{ width: `${(progress / duration) * 100}%` }}
                            />
                        </div>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume & Extras (Desktop) */}
                <div className="hidden md:flex items-center justify-end gap-4 w-1/3">
                    <div className="flex items-center gap-2 group">
                        <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-[hsl(280,80%,60%)]"
                        />
                    </div>
                </div>

                {/* Play/Pause (Mobile) */}
                <div className="md:hidden flex items-center gap-4">
                    <button onClick={togglePlay}>
                        {isPlaying ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
