'use client'

import { useAccount } from 'wagmi';
import { useLikedTracks } from '@/hooks/useLikedTracks';
import NFTCard from '@/components/NFTCard';
import { SkeletonGrid } from '@/components/Skeleton';
import ConnectButton from '@/components/ConnectButton';

export default function LikedTracksPage() {
    const { isConnected } = useAccount();
    const { likedTracks, isLoading } = useLikedTracks();
    const chainId = 11155111; // Default to Sepolia

    if (!isConnected) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="w-24 h-24 bg-[var(--muted)] rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold gradient-text">Connect Wallet</h1>
                    <p className="text-[var(--muted-foreground)] max-w-md">
                        Connect your wallet to view your liked tracks.
                    </p>
                </div>
                <ConnectButton />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center gap-4">
                <a
                    href="/profile"
                    className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </a>
                <h1 className="text-3xl font-bold gradient-text">Liked Tracks</h1>
            </div>

            {isLoading ? (
                <SkeletonGrid count={4} />
            ) : likedTracks.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold">No liked tracks yet</h3>
                    <p className="text-[var(--muted-foreground)] mb-6">
                        Explore the gallery and like some tracks to save them here!
                    </p>
                    <a
                        href="/explore"
                        className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift"
                    >
                        Explore Music
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {likedTracks.map((token) => (
                        <div key={token.tokenId.toString()} className="animate-fade-in">
                            <NFTCard tokenData={token} chainId={chainId} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
