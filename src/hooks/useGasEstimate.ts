'use client'

import { useEstimateGas, useChainId } from 'wagmi';
import { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';
import { formatEther } from 'viem';

export function useGasEstimate(tokenURI: string | null, address: `0x${string}` | undefined) {
    const chainId = useChainId();

    const { data: gasEstimate } = useEstimateGas({
        to: chainId && chainId in MUSIC_NFT_ADDRESSES
            ? (MUSIC_NFT_ADDRESSES[chainId as SupportedChainId] as `0x${string}`)
            : undefined,
        data: tokenURI && address
            ? // Encode mint function call
            `0x${Buffer.from(`mint(address,string)`).toString('hex')}`
            : undefined,
        query: {
            enabled: !!tokenURI && !!address && !!chainId && chainId in MUSIC_NFT_ADDRESSES,
        },
    });

    const formattedEstimate = gasEstimate
        ? `~${parseFloat(formatEther(gasEstimate)).toFixed(6)} ETH`
        : null;

    return {
        gasEstimate,
        formattedEstimate,
        isLoading: !gasEstimate && !!tokenURI && !!address,
    };
}
