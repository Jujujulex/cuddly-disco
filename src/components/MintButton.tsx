'use client'

import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface MintButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    children: ReactNode;
    gasEstimate?: string;
}

export default function MintButton({
    onClick,
    disabled = false,
    isLoading = false,
    children,
    gasEstimate
}: MintButtonProps) {
    return (
        <div className="space-y-2">
            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className={`w-full px-6 py-4 rounded-full font-semibold transition-all ${disabled || isLoading
                        ? 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white hover-lift'
                    }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span>Processing...</span>
                    </div>
                ) : (
                    children
                )}
            </button>

            {gasEstimate && !isLoading && (
                <p className="text-xs text-center text-[var(--muted-foreground)]">
                    Estimated gas: {gasEstimate}
                </p>
            )}
        </div>
    );
}
