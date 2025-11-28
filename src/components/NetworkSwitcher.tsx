'use client'

import { useSwitchChain, useChainId } from 'wagmi';
import { MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';
import { useToast } from '@/context/ToastContext';

const SUPPORTED_NETWORKS = [
    { id: 1, name: 'Ethereum' },
    { id: 42161, name: 'Arbitrum' },
    { id: 11155111, name: 'Sepolia' },
] as const;

export default function NetworkSwitcher() {
    const chainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();
    const toast = useToast();

    const currentNetwork = SUPPORTED_NETWORKS.find(n => n.id === chainId);
    const isSupported = chainId && chainId in MUSIC_NFT_ADDRESSES;

    const handleSwitch = async (networkId: number) => {
        try {
            await switchChain({ chainId: networkId });
            toast.success(`Switched to ${SUPPORTED_NETWORKS.find(n => n.id === networkId)?.name}`);
        } catch (error) {
            console.error('Failed to switch network:', error);
            toast.error('Failed to switch network');
        }
    };

    return (
        <div className="relative">
            <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Network</span>
                    {!isSupported && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500">
                            Unsupported
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    {SUPPORTED_NETWORKS.map((network) => {
                        const isActive = chainId === network.id;
                        const isDeployed = MUSIC_NFT_ADDRESSES[network.id as SupportedChainId] !== '0x0000000000000000000000000000000000000000';

                        return (
                            <button
                                key={network.id}
                                onClick={() => handleSwitch(network.id)}
                                disabled={isPending || isActive || !isDeployed}
                                className={`w-full px-4 py-3 rounded-lg text-left transition-all ${isActive
                                        ? 'bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white'
                                        : isDeployed
                                            ? 'bg-[var(--muted)] hover:bg-[var(--muted)]/70'
                                            : 'bg-[var(--muted)]/50 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{network.name}</span>
                                    {isActive && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                    {!isDeployed && (
                                        <span className="text-xs">Not deployed</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {!isSupported && (
                    <p className="text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                        Please switch to a supported network to use this platform
                    </p>
                )}
            </div>
        </div>
    );
}
