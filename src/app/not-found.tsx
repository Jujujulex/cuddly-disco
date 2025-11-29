export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,70%,50%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-10 blur-3xl"></div>

            <div className="relative z-10 text-center space-y-8 px-4">
                {/* 404 Animation */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-bold gradient-text leading-none animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] opacity-20 blur-3xl animate-pulse"></div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
                    <p className="text-lg text-[var(--muted-foreground)] max-w-md mx-auto">
                        Looks like this track got lost in the mix. Let's get you back to the music!
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                        href="/"
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </a>
                    <a
                        href="/explore"
                        className="px-8 py-4 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] transition-colors inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Explore Music
                    </a>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-center gap-4 pt-8 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-[hsl(263,70%,50%)] animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[hsl(280,80%,60%)] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[hsl(330,80%,55%)] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    )
}
