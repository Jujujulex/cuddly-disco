import UploadForm from '@/components/UploadForm';
import ConnectButton from '@/components/ConnectButton';

export default function UploadPage() {
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
                <ConnectButton />
            </nav>

            {/* Main Content */}
            <main className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
                <div className="animate-fade-in space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Upload Your Music</h1>
                        <p className="text-[var(--muted-foreground)] text-lg">
                            Upload your track to IPFS and mint it as an NFT
                        </p>
                    </div>

                    <UploadForm />
                </div>
            </main>
        </div>
    );
}
