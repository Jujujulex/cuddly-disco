export function SkeletonCard() {
    return (
        <div className="glass rounded-xl p-4 space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-[var(--muted)]"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--muted)] rounded w-3/4"></div>
                    <div className="h-3 bg-[var(--muted)] rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--muted)]"></div>
            </div>
            <div className="space-y-2">
                <div className="h-2 bg-[var(--muted)] rounded"></div>
                <div className="flex justify-between">
                    <div className="h-2 bg-[var(--muted)] rounded w-12"></div>
                    <div className="h-2 bg-[var(--muted)] rounded w-12"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
