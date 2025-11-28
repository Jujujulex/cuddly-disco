'use client'

import { useState } from 'react';

interface FilterPanelProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    sortBy: 'newest' | 'oldest' | 'name';
    genres: string[];
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const genres = ['Electronic', 'Hip Hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'Other'];

    const handleSortChange = (value: 'newest' | 'oldest' | 'name') => {
        setSortBy(value);
        onFilterChange({ sortBy: value, genres: selectedGenres });
    };

    const handleGenreToggle = (genre: string) => {
        const newGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];

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
