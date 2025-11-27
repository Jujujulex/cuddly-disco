export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-[var(--border)] mt-20">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)]"></div>
                            <span className="text-xl font-bold gradient-text">Cuddly Disco</span>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Onchain music platform for artists and collectors
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li><a href="/upload" className="hover:text-[var(--foreground)] transition-colors">Upload</a></li>
                            <li><a href="/profile" className="hover:text-[var(--foreground)] transition-colors">Profile</a></li>
                            <li><a href="/" className="hover:text-[var(--foreground)] transition-colors">Explore</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li><a href="/docs/DEPLOYMENT.md" className="hover:text-[var(--foreground)] transition-colors">Docs</a></li>
                            <li><a href="https://github.com/Jujujulex/cuddly-disco" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">GitHub</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Community</h3>
                        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
                    <p>&copy; 2025 Cuddly Disco. Built with ❤️ for Web3 artists.</p>
                </div>
            </div>
        </footer>
    );
}
