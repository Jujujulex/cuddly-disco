'use client'

import NFTCard from './NFTCard';
import type { TokenData } from '@/types/metadata';

interface TrendingSectionProps {
    tokens: TokenData[];
    title: string;
}

export default function TrendingSection({ tokens, title }: TrendingSectionProps) {
    if (tokens.length === 0) return null;

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">{title}</h2>
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Trending</span>
                </div>
            </div>

            <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                    {tokens.map((token) => (
                        <div
                            key={token.tokenId.toString()}
                            className="flex-none w-80 snap-start"
                        >
                            <NFTCard tokenData={token} />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
