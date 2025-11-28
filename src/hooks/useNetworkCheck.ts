'use client'

import { useChainId } from 'wagmi';
import { MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';

export function useNetworkCheck() {
    const chainId = useChainId();

    const isSupported = chainId ? chainId in MUSIC_NFT_ADDRESSES : false;
    const isDeployed = chainId && isSupported
        ? MUSIC_NFT_ADDRESSES[chainId as SupportedChainId] !== '0x0000000000000000000000000000000000000000'
        : false;

    const networkName = chainId
        ? {
            1: 'Ethereum',
            42161: 'Arbitrum',
            11155111: 'Sepolia',
        }[chainId] || 'Unknown'
        : 'No network';

    return {
        chainId,
        isSupported,
        isDeployed,
        networkName,
        isReady: isSupported && isDeployed,
    };
}
