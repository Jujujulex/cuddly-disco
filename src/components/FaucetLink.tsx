'use client'

export default function FaucetLink() {
    return (
        <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-bold gradient-text">Need Testnet ETH?</h3>
            <p className="text-[var(--muted-foreground)]">
                To mint NFTs on the Sepolia testnet, you need Sepolia ETH for gas fees.
                You can get some for free from a faucet.
            </p>
            <a
                href="https://sepoliafaucet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
                <span>Go to Alchemy Faucet</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        </div>
    );
}
