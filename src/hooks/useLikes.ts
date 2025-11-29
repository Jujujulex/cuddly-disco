'use client'

import { useState, useEffect } from 'react';

const LIKES_STORAGE_KEY = 'cuddly_disco_likes';

export function useLikes() {
    const [likedTokenIds, setLikedTokenIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(LIKES_STORAGE_KEY);
        if (stored) {
            try {
                setLikedTokenIds(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing likes:', e);
            }
        }
    }, []);

    const toggleLike = (tokenId: string) => {
        setLikedTokenIds(prev => {
            const newLikes = prev.includes(tokenId)
                ? prev.filter(id => id !== tokenId)
                : [...prev, tokenId];

            localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(newLikes));
            return newLikes;
        });
    };

    const isLiked = (tokenId: string) => likedTokenIds.includes(tokenId);

    return { likedTokenIds, toggleLike, isLiked };
}
