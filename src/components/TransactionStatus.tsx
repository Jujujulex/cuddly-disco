interface TransactionStatusProps {
    hash?: `0x${string}`;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error?: Error | null;
}

export default function TransactionStatus({
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
}: TransactionStatusProps) {
    if (!hash && !isPending && !error) return null;

    return (
        <div className="glass rounded-xl p-4 space-y-3">
            {/* Pending */}
            {isPending && (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                        <p className="font-semibold text-blue-500">Waiting for approval</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                            Please confirm the transaction in your wallet
                        </p>
                    </div>
                </div>
            )}

            {/* Confirming */}
            {isConfirming && hash && (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-yellow-500">Transaction confirming</p>
                        <a
                            href={`https://etherscan.io/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
                        >
                            View on Explorer
                        </a>
                    </div>
                </div>
            )}

            {/* Success */}
            {isSuccess && hash && (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-green-500">Transaction successful!</p>
                        <a
                            href={`https://etherscan.io/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
                        >
                            View on Explorer
                        </a>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-red-500">Transaction failed</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{error.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
