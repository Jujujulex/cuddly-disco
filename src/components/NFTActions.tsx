'use client'

import { useState } from 'react';

interface NFTActionsProps {
    tokenId: bigint;
    contractAddress: string;
    chainId?: number;
    metadataUrl?: string;
}

export default function NFTActions({ tokenId, contractAddress, chainId, metadataUrl }: NFTActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const explorerUrl = chainId
        ? {
            1: `https://etherscan.io/token/${contractAddress}?a=${tokenId}`,
            42161: `https://arbiscan.io/token/${contractAddress}?a=${tokenId}`,
            11155111: `https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`,
        }[chainId]
        : `https://etherscan.io/token/${contractAddress}?a=${tokenId}`;

    const actions = [
        {
            label: 'View on Explorer',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            ),
            onClick: () => window.open(explorerUrl, '_blank'),
        },
        {
            label: 'Share',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            ),
            onClick: () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Check out my NFT!',
                        url: explorerUrl,
                    });
                } else {
                    navigator.clipboard.writeText(explorerUrl);
                    alert('Link copied to clipboard!');
                }
            },
        },
        {
            label: 'Download Metadata',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
            onClick: () => {
                if (metadataUrl) {
                    window.open(metadataUrl, '_blank');
                }
            },
            disabled: !metadataUrl,
        },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-[var(--muted)] transition-all"
                aria-label="NFT Actions"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-lg z-50 overflow-hidden">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    action.onClick();
                                    setIsOpen(false);
                                }}
                                disabled={action.disabled}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${action.disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-[var(--muted)]'
                                    }`}
                            >
                                {action.icon}
                                <span className="text-sm font-medium">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
