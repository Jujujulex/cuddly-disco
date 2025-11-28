'use client'

import { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { getAudioUrl, getImageUrl, formatTokenId } from '@/lib/nft';
import type { TokenData } from '@/types/metadata';

interface NFTCardProps {
    tokenData: TokenData;
    chainId?: number;
}

export default function NFTCard({ tokenData, chainId }: NFTCardProps) {
    const [imageError, setImageError] = useState(false);
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

    return (
        <div className="glass rounded-xl overflow-hidden hover-lift transition-all">
            {/* Cover Art */}
            {imageUrl && !imageError && (
                <div className="relative w-full aspect-square bg-[var(--muted)]">
                    <img
                        src={imageUrl}
                        alt={metadata.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full glass text-xs font-mono">
                        {formatTokenId(tokenId)}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Title & Artist */}
                <div>
                    <h3 className="font-bold text-lg truncate">{metadata.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] truncate">
                        {metadata.artist}
                    </p>
                </div>

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

                {/* Audio Player */}
                {audioUrl && (
                    <AudioPlayer
                        audioUrl={audioUrl}
                        title={metadata.name}
                        artist={metadata.artist}
                        coverUrl={imageUrl || undefined}
                    />
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
