interface ErrorFallbackProps {
    error: Error;
    resetError: () => void;
}

export default function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
            <div className="glass rounded-2xl p-8 max-w-lg space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-500">Error Occurred</h2>
                        <p className="text-sm text-[var(--muted-foreground)]">Something unexpected happened</p>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                    <p className="text-sm font-mono text-[var(--foreground)] break-all">
                        {error.message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={resetError}
                        className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 px-6 py-3 rounded-full glass text-[var(--foreground)] font-semibold hover:bg-[var(--muted)] transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
