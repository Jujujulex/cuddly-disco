'use client'

import { useState } from 'react';

interface FilterPanelProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    sortBy: 'newest' | 'oldest' | 'name';
    genres: string[];
    showLikedOnly: boolean;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        sortBy: 'newest',
        genres: [],
        showLikedOnly: false,
    });

    const genres = ['Electronic', 'Hip Hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'Other'];

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleGenreToggle = (genre: string) => {

        setSelectedGenres(newGenres);
        onFilterChange({ sortBy, genres: newGenres });
    };

    const handleClearAll = () => {
        setSortBy('newest');
        setSelectedGenres([]);
        onFilterChange({ sortBy: 'newest', genres: [] });
    };

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-full px-4 py-3 rounded-full glass flex items-center justify-center gap-2 font-semibold mb-4"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
            </button>

            {/* Filter Panel */}
            <div className={`glass rounded-2xl p-6 space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Filters</h3>
                    {(selectedGenres.length > 0 || sortBy !== 'newest') && (
                        <button
                            onClick={handleClearAll}
                            className="text-sm text-[hsl(280,80%,60%)] hover:underline"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Sort By */}
                <div>
                    <h4 className="font-semibold mb-3">Sort By</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'newest', label: 'Newest First' },
                            { value: 'oldest', label: 'Oldest First' },
                            { value: 'name', label: 'Name (A-Z)' },
                        ].map((option) => (
                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sort"
                                    value={option.value}
                                    checked={sortBy === option.value}
                                    onChange={() => handleSortChange(option.value as any)}
                                    className="w-4 h-4 accent-[hsl(280,80%,60%)]"
                                />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Liked Filter */}
                <div className="space-y-3 pb-6 border-b border-[var(--border)]">
                    <h3 className="font-bold">Favorites</h3>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={showLikedOnly}
                                onChange={(e) => handleShowLikedOnlyToggle(e.target.checked)}
                            />
                            <div className="w-10 h-6 bg-[var(--muted)] rounded-full peer peer-checked:bg-red-500 transition-colors"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                        </div>
                        <span className="text-sm group-hover:text-[var(--foreground)] transition-colors">
                            Show Liked Only
                        </span>
                    </label>
                </div>

                {/* Genre Filter */}
                <div>
                    <h4 className="font-semibold mb-3">Genre</h4>
                    <div className="space-y-2">
                        {genres.map((genre) => (
                            <label key={genre} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => handleGenreToggle(genre)}
                                    className="w-4 h-4 rounded accent-[hsl(280,80%,60%)]"
                                />
                                <span className="text-sm">{genre}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
