'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { TokenData } from '@/types/metadata';

export interface Playlist {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    tracks: TokenData[];
    createdAt: number;
}

interface PlaylistContextType {
    playlists: Playlist[];
    createPlaylist: (name: string, description?: string) => void;
    deletePlaylist: (id: string) => void;
    addTrackToPlaylist: (playlistId: string, track: TokenData) => void;
    removeTrackFromPlaylist: (playlistId: string, tokenId: string) => void;
    getPlaylist: (id: string) => Playlist | undefined;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const STORAGE_KEY = 'cuddly_disco_playlists';

export function PlaylistProvider({ children }: { children: ReactNode }) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    // Load from storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setPlaylists(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing playlists:', e);
            }
        }
    }, []);

    // Save to storage whenever playlists change
    useEffect(() => {
        if (playlists.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
        }
    }, [playlists]);

    const createPlaylist = (name: string, description?: string) => {
        const newPlaylist: Playlist = {
            id: crypto.randomUUID(),
            name,
            description,
            tracks: [],
            createdAt: Date.now(),
        };
        setPlaylists(prev => [...prev, newPlaylist]);
    };

    const deletePlaylist = (id: string) => {
        setPlaylists(prev => prev.filter(p => p.id !== id));
    };

    const addTrackToPlaylist = (playlistId: string, track: TokenData) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                // Avoid duplicates
                if (p.tracks.some(t => t.tokenId.toString() === track.tokenId.toString())) {
                    return p;
                }
                return { ...p, tracks: [...p.tracks, track] };
            }
            return p;
        }));
    };

    const removeTrackFromPlaylist = (playlistId: string, tokenId: string) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return { ...p, tracks: p.tracks.filter(t => t.tokenId.toString() !== tokenId) };
            }
            return p;
        }));
    };

    const getPlaylist = (id: string) => playlists.find(p => p.id === id);

    return (
        <PlaylistContext.Provider value={{
            playlists,
            createPlaylist,
            deletePlaylist,
            addTrackToPlaylist,
            removeTrackFromPlaylist,
            getPlaylist
        }}>
            {children}
        </PlaylistContext.Provider>
    );
}

export function usePlaylists() {
    const context = useContext(PlaylistContext);
    if (context === undefined) {
        throw new Error('usePlaylists must be used within a PlaylistProvider');
    }
    return context;
}
