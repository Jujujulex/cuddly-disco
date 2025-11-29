'use client'

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';
import type { TokenData } from '@/types/metadata';
import { batchFetchNFTData } from '@/lib/nft';

export function useExploreNFTs() {
    const { chainId } = useAccount();
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchTokens() {
            if (!chainId || !(chainId in MUSIC_NFT_ADDRESSES)) {
                // If not connected or wrong chain, maybe show some mock data or empty
                // For now, let's return empty
                setTokens([]);
                return;
            }

            setIsLoading(true);
            const contractAddress = MUSIC_NFT_ADDRESSES[chainId as SupportedChainId];

            try {
                // Fetch total supply to know how many tokens to fetch
                const supplyResponse = await fetch('/api/contract/totalSupply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contractAddress,
                        chainId,
                    }),
                });

                if (!supplyResponse.ok) throw new Error('Failed to fetch total supply');
                const { totalSupply } = await supplyResponse.json();
                const count = Number(totalSupply);

                // Fetch last 20 tokens (or all if less than 20)
                // We iterate backwards to get newest first
                const start = Math.max(0, count - 20);
                const promises = [];

                for (let i = count - 1; i >= start; i--) {
                    promises.push((async () => {
                        // For ERC721Enumerable, tokenByIndex might be useful, 
                        // but usually token IDs are sequential 0, 1, 2... or 1, 2, 3...
                        // If we assume sequential IDs starting from 0:
                        const tokenId = i;

                        // Get URI
                        const uriResponse = await fetch('/api/contract/tokenURI', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contractAddress,
                                tokenId,
                                chainId,
                            }),
                        });

                        if (!uriResponse.ok) return null;
                        const { tokenURI } = await uriResponse.json();

                        return {
                            tokenId: BigInt(tokenId),
                            tokenURI,
                            owner: '0x0000000000000000000000000000000000000000', // Placeholder
                        } as TokenData;
                    })());
                }

                const results = await Promise.all(promises);
                const validTokens = results.filter((t): t is TokenData => t !== null);

                const tokensWithMetadata = await batchFetchNFTData(validTokens);
                setTokens(tokensWithMetadata);

            } catch (err) {
                console.error('Error fetching explore NFTs:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch NFTs'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchTokens();
    }, [chainId]);

    return { tokens, isLoading, error };
}
