```javascript
'use client'

import { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import ConnectButton from '@/components/ConnectButton';
import NFTCard from '@/components/NFTCard';
import { SkeletonGrid } from '@/components/Skeleton';
import { useUserNFTs } from '@/hooks/useUserNFTs';
import { batchFetchNFTData } from '@/lib/nft';
import type { TokenData } from '@/types/metadata';
import FaucetLink from '@/components/FaucetLink';
import EditProfileModal from '@/components/EditProfileModal';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { tokens: rawTokens, isLoading: isFetchingTokens, error: fetchError } = useUserNFTs(address);
    const { profile } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const chainId = 11155111; // Default to Sepolia for now
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    // Fetch metadata for tokens
    useEffect(() => {
        async function loadMetadata() {
            if (rawTokens.length === 0) {
                setTokens([]);
                return;
            }

            setIsLoadingMetadata(true);
            try {
                const tokensWithMetadata = await batchFetchNFTData(rawTokens);
                setTokens(tokensWithMetadata);
            } catch (error) {
                console.error('Error loading metadata:', error);
                setTokens(rawTokens); // Show tokens without metadata
            } finally {
                setIsLoadingMetadata(false);
            }
        }

        loadMetadata();
    }, [rawTokens]);

    const isLoading = isFetchingTokens || isLoadingMetadata;

    if (!isConnected) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,70%,50%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-10 blur-3xl"></div>

                <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
                    <a href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)]"></div>
                        <span className="text-xl font-bold gradient-text">Cuddly Disco</span>
                    </a>
                    <ConnectButton />
                </nav>

                <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-6">
                    <div className="glass rounded-2xl p-12 text-center max-w-md">
                        <h2 className="text-2xl font-bold gradient-text mb-4">Connect Your Wallet</h2>
                        <p className="text-[var(--muted-foreground)] mb-6">
                            Please connect your wallet to view your music NFT collection
                        </p>
                        <ConnectButton />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,70%,50%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-10 blur-3xl"></div>

            <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
                <a href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)]"></div>
                    <span className="text-xl font-bold gradient-text">Cuddly Disco</span>
                </a>
                <div className="flex items-center gap-4">
                    <a
                        href="/upload"
                        className="px-6 py-2 rounded-full glass text-[var(--foreground)] font-semibold hover:bg-[var(--muted)] transition-all"
                    >
                        Upload
                    </a>
                    <ConnectButton />
                </div>
            </nav>

            <main className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
                <div className="animate-fade-in space-y-8">
                    {/* Profile Header */}
                    <div className="glass rounded-2xl p-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] flex items-center justify-center text-2xl font-bold text-white">
                                {address?.slice(2, 4).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold gradient-text">{profile?.name || 'My Collection'}</h1>
                                <p className="text-sm text-[var(--muted-foreground)] font-mono">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
                            <div>
                                <div className="text-2xl font-bold gradient-text">{tokens.length}</div>
                                <div className="text-sm text-[var(--muted-foreground)]">NFTs Owned</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold gradient-text">0</div>
                                <div className="text-sm text-[var(--muted-foreground)]">Minted</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold gradient-text">0</div>
                                <div className="text-sm text-[var(--muted-foreground)]">Collected</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            {/* NFT Grid */}
                            <div>
                                <h2 className="text-xl font-bold mb-4">Your Music NFTs</h2>
                                {fetchError && (
                                    <div className="glass rounded-2xl p-6 text-center border border-red-500/50">
                                        <p className="text-red-500">{fetchError.message}</p>
                                    </div>
                                )}
                                {isLoading ? (
                                    <SkeletonGrid count={4} />
                                ) : tokens.length === 0 ? (
                                    <div className="glass rounded-2xl p-12 text-center">
                                        <p className="text-[var(--muted-foreground)] mb-4">
                                            You don't have any music NFTs yet
                                        </p>
                                        <a
                                            href="/upload"
                                            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift"
                                        >
                                            Upload Your First Track
                                        </a>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tokens.map((token) => (
                                            <div key={token.tokenId.toString()} className="animate-fade-in">
                                                <NFTCard tokenData={token} chainId={chainId} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <FaucetLink />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
