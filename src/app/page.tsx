import ConnectButton from "@/components/ConnectButton";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,70%,50%)] via-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-20 blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)]"></div>
          <span className="text-xl font-bold gradient-text">Cuddly Disco</span>
        </div>
        <ConnectButton />
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in space-y-8 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(280,80%,60%)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(280,80%,60%)]"></span>
            </span>
            <span className="text-[var(--muted-foreground)]">Powered by Web3</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
            Create, Upload & Mint Your Music Onchain
          </h1>

          {/* Subheading */}
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
            The decentralized platform for artists to upload, mint, and share their music as NFTs
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="/upload"
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift transition-all duration-300"
            >
              <span className="relative z-10">Start Creating</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(280,80%,60%)] to-[hsl(330,80%,55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/profile"
              className="px-8 py-4 rounded-full glass text-[var(--foreground)] font-semibold hover:bg-[var(--muted)] transition-all duration-300"
            >
              Explore Music
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12">
            <div>
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-[var(--muted-foreground)]">Tracks Minted</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">5K+</div>
              <div className="text-sm text-[var(--muted-foreground)]">Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">15K+</div>
              <div className="text-sm text-[var(--muted-foreground)]">Collectors</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[hsl(263,70%,50%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-[hsl(330,80%,55%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </main>

      <Footer />
    </div>
  );
}
