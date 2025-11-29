'use client'

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useLikes } from './useLikes';
import { MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';
import type { TokenData } from '@/types/metadata';
import { batchFetchNFTData } from '@/lib/nft';

export function useLikedTracks() {
    const { address, chainId } = useAccount();
    const { likedTokenIds } = useLikes();
    const [likedTracks, setLikedTracks] = useState<TokenData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchLikedTracks() {
            if (likedTokenIds.length === 0 || !chainId || !(chainId in MUSIC_NFT_ADDRESSES)) {
                setLikedTracks([]);
                return;
            }

            setIsLoading(true);
            const contractAddress = MUSIC_NFT_ADDRESSES[chainId as SupportedChainId];

            try {
                // 1. Fetch Token URIs for all liked IDs
                const promises = likedTokenIds.map(async (id) => {
                    try {
                        const response = await fetch('/api/contract/tokenURI', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contractAddress,
                                tokenId: id,
                                chainId,
                            }),
                        });

                        if (!response.ok) return null;
                        const { tokenURI } = await response.json();

                        // We don't know the owner without another call, but for display it might not matter
                        // Or we can fetch ownerOf if needed. For now, use a placeholder or fetch it.
                        // Let's skip owner for now to save calls, or fetch it if critical.

                        return {
                            tokenId: BigInt(id),
                            tokenURI,
                            owner: '0x0000000000000000000000000000000000000000', // Placeholder
                        } as TokenData;
                    } catch (e) {
                        console.error(`Error fetching token ${id}:`, e);
                        return null;
                    }
                });

                const results = await Promise.all(promises);
                const validTokens = results.filter((t): t is TokenData => t !== null);

                // 2. Fetch Metadata
                const tokensWithMetadata = await batchFetchNFTData(validTokens);
                setLikedTracks(tokensWithMetadata);

            } catch (error) {
                console.error('Error fetching liked tracks:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLikedTracks();
    }, [likedTokenIds, chainId]);

    return { likedTracks, isLoading };
}
