'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from '@/components/ConnectButton';
import NFTCard from '@/components/NFTCard';
import SearchBar from '@/components/SearchBar';
import FilterPanel, { type FilterState } from '@/components/FilterPanel';
import TrendingSection from '@/components/TrendingSection';
import { SkeletonGrid } from '@/components/Skeleton';
import { useUserNFTs } from '@/hooks/useUserNFTs';
import { batchFetchNFTData } from '@/lib/nft';
import { sortTokens, filterByGenres, getTrendingTokens } from '@/lib/explore';
import type { TokenData } from '@/types/metadata';

export default function ExplorePage() {
    const { isConnected } = useAccount();
    const { tokens: rawTokens, isLoading: isFetchingTokens } = useUserNFTs();
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterState, setFilterState] = useState<FilterState>({ sortBy: 'newest', genres: [] });
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
                setTokens(rawTokens);
            } finally {
                setIsLoadingMetadata(false);
            }
        }

        loadMetadata();
    }, [rawTokens]);

    // Filter and sort tokens
    useEffect(() => {
        let result = [...tokens];

        // 1. Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((token) => {
                const title = token.metadata?.name?.toLowerCase() || '';
                const artist = token.metadata?.artist?.toLowerCase() || '';
                return title.includes(query) || artist.includes(query);
            });
        }

        // 2. Filter by Genre
        result = filterByGenres(result, filterState.genres);

        // 3. Sort
        result = sortTokens(result, filterState.sortBy);

        setFilteredTokens(result);
    }, [tokens, searchQuery, filterState]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleFilterChange = useCallback((newFilters: FilterState) => {
        setFilterState(newFilters);
    }, []);

    const trendingTokens = useMemo(() => getTrendingTokens(tokens), [tokens]);
    const isLoading = isFetchingTokens || isLoadingMetadata;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,70%,50%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-10 blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
                <a href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)]"></div>
                    <span className="text-xl font-bold gradient-text">Cuddly Disco</span>
                </a>
                <div className="flex items-center gap-4">
                    <a href="/explore" className="text-sm font-medium text-[hsl(280,80%,60%)] transition-colors">
                        Explore
                    </a>
                    <a href="/upload" className="text-sm font-medium hover:text-[hsl(280,80%,60%)] transition-colors">
                        Upload
                    </a>
                    <a href="/profile" className="text-sm font-medium hover:text-[hsl(280,80%,60%)] transition-colors">
                        Profile
                    </a>
                    <ConnectButton />
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:px-12">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                        Explore Music NFTs
                    </h1>
                    <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
                        Discover amazing music from artists around the world
                    </p>
                </div>

                {/* Trending Section */}
                {!isLoading && trendingTokens.length > 0 && (
                    <TrendingSection tokens={trendingTokens} title="Trending Now" />
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="md:col-span-1">
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </div>

                    {/* Main Grid Area */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Search Bar */}
                        <div>
                            <SearchBar onSearch={handleSearch} />
                            {(searchQuery || filterState.genres.length > 0) && (
                                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                    Found {filteredTokens.length} result{filteredTokens.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* NFT Grid */}
                        {!isConnected ? (
                            <div className="glass rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                                <p className="text-[var(--muted-foreground)] mb-6">
                                    Connect your wallet to explore music NFTs
                                </p>
                                <ConnectButton />
                            </div>
                        ) : isLoading ? (
                            <SkeletonGrid count={6} />
                        ) : filteredTokens.length === 0 ? (
                            <div className="glass rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--muted)] flex items-center justify-center">
                                    <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Matches Found</h3>
                                <p className="text-[var(--muted-foreground)] mb-6">
                                    Try adjusting your filters or search query
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterState({ sortBy: 'newest', genres: [] });
                                    }}
                                    className="text-[hsl(280,80%,60%)] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTokens.map((token) => (
                                    <div key={token.tokenId.toString()} className="animate-fade-in">
                                        <NFTCard tokenData={token} />
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
