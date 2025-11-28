'use client'

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { TokenData } from '@/types/metadata';

interface AudioContextType {
    currentTrack: TokenData | null;
    isPlaying: boolean;
    queue: TokenData[];
    volume: number;
    progress: number;
    duration: number;
    isShuffle: boolean;
    isRepeat: boolean;
    playTrack: (track: TokenData) => void;
    togglePlay: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    addToQueue: (track: TokenData) => void;
    removeFromQueue: (tokenId: string) => void;
    setVolume: (volume: number) => void;
    seek: (time: number) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<TokenData | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<TokenData[]>([]);
    const [volume, setVolumeState] = useState(0.8);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => nextTrack();

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [queue, isRepeat, isShuffle]); // Re-bind if queue logic changes (though nextTrack handles it)

    // Play a specific track
    const playTrack = useCallback((track: TokenData) => {
        setCurrentTrack(track);
        setIsPlaying(true);
        // Add to queue if not present
        setQueue(prev => {
            if (prev.find(t => t.tokenId === track.tokenId)) return prev;
            return [...prev, track];
        });
    }, []);

    // Toggle Play/Pause
    const togglePlay = useCallback(() => {
        if (!currentTrack) return;

        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    }, [currentTrack, isPlaying]);

    // Sync isPlaying state with actual audio element
    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.error("Play failed:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [currentTrack, isPlaying]);

    // Next Track
    const nextTrack = useCallback(() => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(t => t.tokenId === currentTrack?.tokenId);

        if (isRepeat && queue.length === 1) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
            return;
        }

        let nextIndex;
        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else {
            nextIndex = (currentIndex + 1) % queue.length;
        }

        setCurrentTrack(queue[nextIndex]);
        setIsPlaying(true);
    }, [queue, currentTrack, isShuffle, isRepeat]);

    // Previous Track
    const previousTrack = useCallback(() => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(t => t.tokenId === currentTrack?.tokenId);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;

        setCurrentTrack(queue[prevIndex]);
        setIsPlaying(true);
    }, [queue, currentTrack]);

    const addToQueue = useCallback((track: TokenData) => {
        setQueue(prev => [...prev, track]);
    }, []);

    const removeFromQueue = useCallback((tokenId: string) => {
        setQueue(prev => prev.filter(t => t.tokenId.toString() !== tokenId));
    }, []);

    const setVolume = useCallback((vol: number) => {
        setVolumeState(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    }, []);

    const toggleShuffle = () => setIsShuffle(!isShuffle);
    const toggleRepeat = () => setIsRepeat(!isRepeat);

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            queue,
            volume,
            progress,
            duration,
            isShuffle,
            isRepeat,
            playTrack,
            togglePlay,
            nextTrack,
            previousTrack,
            addToQueue,
            removeFromQueue,
            setVolume,
            seek,
            toggleShuffle,
            toggleRepeat,
            audioRef
        }}>
            {children}
            <audio
                ref={audioRef}
                src={currentTrack?.metadata?.audio || ''}
                preload="auto"
                crossOrigin="anonymous"
            />
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
