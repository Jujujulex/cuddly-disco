'use client'

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
    audioUrl: string;
    title: string;
    artist: string;
    coverUrl?: string;
}

export default function AudioPlayer({ audioUrl, title, artist, coverUrl }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass rounded-xl p-4 space-y-4">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            <div className="flex items-center gap-4">
                {/* Cover Art */}
                {coverUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{title}</h4>
                    <p className="text-sm text-[var(--muted-foreground)] truncate">{artist}</p>
                </div>

                {/* Play Button */}
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] flex items-center justify-center hover-lift flex-shrink-0"
                >
                    {isPlaying ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[hsl(263,70%,50%)] [&::-webkit-slider-thumb]:to-[hsl(280,80%,60%)]"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
}
