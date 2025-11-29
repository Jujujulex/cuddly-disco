import { useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import NFTActions from './NFTActions';
import LikeButton from './LikeButton';
import AddToPlaylistMenu from './AddToPlaylistMenu';
import { getAudioUrl, getImageUrl, formatTokenId } from '@/lib/nft';
import type { TokenData } from '@/types/metadata';

interface NFTCardProps {
    tokenData: TokenData;
    chainId?: number;
}

export default function NFTCard({ tokenData, chainId }: NFTCardProps) {
    const [imageError, setImageError] = useState(false);
    const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();
    const [showActions, setShowActions] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const { metadata, tokenId } = tokenData;

    if (!metadata) {
        return (
            <div className="glass rounded-xl p-6 text-center">
                <p className="text-[var(--muted-foreground)]">
                    Loading metadata for {formatTokenId(tokenId)}...
                </p>
            </div>
        );
    }

    const audioUrl = getAudioUrl(metadata);
    const imageUrl = getImageUrl(metadata);
    const isCurrentTrack = currentTrack?.tokenId === tokenId;
    const isTrackPlaying = isCurrentTrack && isPlaying;

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCurrentTrack) {
            togglePlay();
        } else {
            playTrack(tokenData);
        }
    };

    return (
        <div className="glass rounded-xl overflow-hidden hover-lift transition-all group">
            {/* Cover Art */}
            {imageUrl && !imageError && (
                <div className="relative w-full aspect-square bg-[var(--muted)] cursor-pointer" onClick={handlePlay}>
                    <img
                        src={imageUrl}
                        alt={metadata.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full glass text-xs font-mono z-10">
                        {formatTokenId(tokenId)}
                    </div>
                    <div className="absolute top-2 left-2 z-10">
                        <LikeButton tokenId={tokenId} className="bg-black/20 backdrop-blur-md text-white hover:bg-white/20" />
                    </div>

                    {/* Play Overlay */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button
                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            {isTrackPlaying ? (
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
            {/* Card Footer */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className={`font-bold text-lg truncate ${isCurrentTrack ? 'text-[hsl(280,80%,60%)]' : ''}`}>
                        {metadata?.name || `Token #${tokenId}`}
                    </h3>
                    {metadata?.artist && (
                        <p className="text-sm text-[var(--muted-foreground)] truncate">{metadata.artist}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
                    >
                        Actions
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                            className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                            title="Add to playlist"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        {showPlaylistMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowPlaylistMenu(false)}
                                />
                                <AddToPlaylistMenu
                                    track={tokenData}
                                    onClose={() => setShowPlaylistMenu(false)}
                                />
                            </>
                        )}
                    </div>
                </div>

                {showActions && (
                    <NFTActions
                        tokenData={tokenData}
                        chainId={chainId}
                        onClose={() => setShowActions(false)}
                    />
                )}
            </div>
            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Description */}
                {metadata.description && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {metadata.description}
                    </p>
                )}

                {/* Attributes */}
                {metadata.attributes && metadata.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {metadata.attributes.slice(0, 3).map((attr, index) => (
                            <div
                                key={index}
                                className="px-2 py-1 rounded-lg bg-[var(--muted)] text-xs"
                            >
                                <span className="text-[var(--muted-foreground)]">
                                    {attr.trait_type}:
                                </span>{' '}
                                <span className="font-semibold">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    {metadata.external_url && (
                        <a
                            href={metadata.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 rounded-full glass text-center text-sm font-semibold hover:bg-[var(--muted)] transition-all"
                        >
                            View Details
                        </a>
                    )}
                    {chainId && (
                        <button
                            onClick={() => {
                                const explorerUrl = `https://etherscan.io/token/${tokenData.tokenURI}`;
                                window.open(explorerUrl, '_blank');
                            }}
                            className="px-4 py-2 rounded-full glass text-sm font-semibold hover:bg-[var(--muted)] transition-all"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
