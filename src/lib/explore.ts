import type { TokenData } from '@/types/metadata';

export function sortTokens(tokens: TokenData[], sortBy: 'newest' | 'oldest' | 'name'): TokenData[] {
    const sorted = [...tokens];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
        case 'oldest':
            return sorted.sort((a, b) => Number(a.tokenId) - Number(b.tokenId));
        case 'name':
            return sorted.sort((a, b) => {
                const nameA = a.metadata?.name?.toLowerCase() || '';
                const nameB = b.metadata?.name?.toLowerCase() || '';
                return nameA.localeCompare(nameB);
            });
        default:
            return sorted;
    }
}

export function filterByGenres(tokens: TokenData[], genres: string[]): TokenData[] {
    if (genres.length === 0) return tokens;

    return tokens.filter((token) => {
        const tokenGenre = token.metadata?.properties?.genre as string | undefined;
        return tokenGenre && genres.includes(tokenGenre);
    });
}

export function getRecentTokens(tokens: TokenData[], count: number = 6): TokenData[] {
    return sortTokens(tokens, 'newest').slice(0, count);
}

export function getTrendingTokens(tokens: TokenData[], count: number = 6): TokenData[] {
    // Simple trending algorithm: newest tokens with metadata
    return tokens
        .filter(t => t.metadata)
        .sort((a, b) => Number(b.tokenId) - Number(a.tokenId))
        .slice(0, count);
}

export function filterByLiked(tokens: TokenData[], likedTokenIds: string[], showLikedOnly: boolean): TokenData[] {
    if (!showLikedOnly) return tokens;
    return tokens.filter(token => likedTokenIds.includes(token.tokenId.toString()));
}
