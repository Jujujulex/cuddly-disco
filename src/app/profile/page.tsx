'use client'

import { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from '@/components/ConnectButton';
import AudioPlayer from '@/components/AudioPlayer';
import { SkeletonGrid } from '@/components/Skeleton';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const [isLoading] = useState(false);

    // Mock data - in production, fetch from smart contract
    const mockNFTs = [
        {
            id: 1,
            title: 'Summer Vibes',
            artist: 'DJ Crypto',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            coverUrl: 'https://picsum.photos/seed/1/400/400',
            tokenURI: 'ipfs://QmExample1',
        },
        {
            id: 2,
            title: 'Midnight Dreams',
            artist: 'Web3 Producer',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            coverUrl: 'https://picsum.photos/seed/2/400/400',
            tokenURI: 'ipfs://QmExample2',
        },
    ];

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
                                <h1 className="text-2xl font-bold gradient-text">My Collection</h1>
                                <p className="text-sm text-[var(--muted-foreground)] font-mono">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
                            <div>
                                <div className="text-2xl font-bold gradient-text">{mockNFTs.length}</div>
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
                    </div>

                    {/* NFT Grid */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Your Music NFTs</h2>
                        {isLoading ? (
                            <SkeletonGrid count={4} />
                        ) : mockNFTs.length === 0 ? (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mockNFTs.map((nft) => (
                                    <div key={nft.id} className="animate-fade-in">
                                        <AudioPlayer
                                            audioUrl={nft.audioUrl}
                                            title={nft.title}
                                            artist={nft.artist}
                                            coverUrl={nft.coverUrl}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
