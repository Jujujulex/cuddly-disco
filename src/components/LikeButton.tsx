'use client'

import { useLikes } from '@/hooks/useLikes';
import { formatTokenId } from '@/lib/nft';

interface LikeButtonProps {
    tokenId: bigint;
    className?: string;
}

export default function LikeButton({ tokenId, className = '' }: LikeButtonProps) {
    const { isLiked, toggleLike } = useLikes();
    const idString = tokenId.toString();
    const liked = isLiked(idString);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleLike(idString);
    };

    return (
        <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${liked
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10'
                } ${className}`}
            title={liked ? 'Unlike' : 'Like'}
        >
            <svg
                className={`w-5 h-5 transition-transform ${liked ? 'fill-current scale-110' : 'scale-100'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
}
