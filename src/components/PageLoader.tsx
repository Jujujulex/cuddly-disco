import LoadingSpinner from './LoadingSpinner';

export default function PageLoader({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-[var(--muted-foreground)]">{message}</p>
            </div>
        </div>
    );
}
