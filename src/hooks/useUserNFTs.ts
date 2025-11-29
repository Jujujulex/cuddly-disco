'use client'

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';
import type { TokenData } from '@/types/metadata';

export function useUserNFTs(customAddress?: string) {
    const { address: connectedAddress, chainId } = useAccount();
    const address = customAddress || connectedAddress;
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Get user's NFT balance
    const { data: balance } = useReadContract({
        address: chainId && chainId in MUSIC_NFT_ADDRESSES
            ? (MUSIC_NFT_ADDRESSES[chainId as SupportedChainId] as `0x${string}`)
            : undefined,
        abi: MUSIC_NFT_ABI,
        functionName: 'balanceOf',
        args: address ? [address as `0x${string}`] : undefined,
        query: {
            enabled: !!address && !!chainId && chainId in MUSIC_NFT_ADDRESSES,
        },
    });

    useEffect(() => {
        async function fetchTokens() {
            if (!address || !chainId || !balance || !(chainId in MUSIC_NFT_ADDRESSES)) {
                setTokens([]);
                return;
            }

            const contractAddress = MUSIC_NFT_ADDRESSES[chainId as SupportedChainId];
            if (contractAddress === '0x0000000000000000000000000000000000000000') {
                setError(new Error('Contract not deployed on this network'));
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const tokenCount = Number(balance);
                const tokenPromises: Promise<TokenData>[] = [];

                // Fetch each token owned by the user
                for (let i = 0; i < tokenCount; i++) {
                    tokenPromises.push(
                        (async () => {
                            // Get token ID by index
                            const tokenIdResponse = await fetch('/api/contract/tokenOfOwnerByIndex', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contractAddress,
                                    owner: address,
                                    index: i,
                                    chainId,
                                }),
                            });

                            if (!tokenIdResponse.ok) {
                                throw new Error('Failed to fetch token ID');
                            }

                            const { tokenId } = await tokenIdResponse.json();

                            // Get token URI
                            const tokenURIResponse = await fetch('/api/contract/tokenURI', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contractAddress,
                                    tokenId,
                                    chainId,
                                }),
                            });

                            if (!tokenURIResponse.ok) {
                                throw new Error('Failed to fetch token URI');
                            }

                            const { tokenURI } = await tokenURIResponse.json();

                            return {
                                tokenId: BigInt(tokenId),
                                tokenURI,
                                owner: address,
                            };
                        })()
                    );
                }

                const fetchedTokens = await Promise.all(tokenPromises);
                setTokens(fetchedTokens);
            } catch (err) {
                console.error('Error fetching user NFTs:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch NFTs'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchTokens();
    }, [address, chainId, balance]);

    return {
        tokens,
        totalCount: tokens.length,
        isLoading,
        error,
    };
}
