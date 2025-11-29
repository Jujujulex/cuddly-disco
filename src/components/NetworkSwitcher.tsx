'use client'

import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';

// Sepolia Chain ID
const TARGET_CHAIN_ID = 11155111;

export default function NetworkSwitcher() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);

    useEffect(() => {
        setIsWrongNetwork(isConnected && chainId !== TARGET_CHAIN_ID);
    }, [isConnected, chainId]);

    if (!isWrongNetwork) return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 animate-bounce-in">
            <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="font-bold text-sm">Wrong Network</span>
                    <span className="text-xs opacity-90">Please switch to Sepolia</span>
                </div>
                <button
                    onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
                    disabled={isPending}
                    className="bg-white text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Switching...' : 'Switch'}
                </button>
            </div>
        </div>
    );
}
