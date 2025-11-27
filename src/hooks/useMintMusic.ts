'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MUSIC_NFT_ABI, MUSIC_NFT_ADDRESSES, type SupportedChainId } from '@/contracts/MusicNFT';
import { useAccount } from 'wagmi';

export function useMintMusic() {
    const { address, chainId } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const mint = async (tokenURI: string) => {
        if (!address) {
            throw new Error('Wallet not connected');
        }

        if (!chainId || !(chainId in MUSIC_NFT_ADDRESSES)) {
            throw new Error('Unsupported network');
        }

        const contractAddress = MUSIC_NFT_ADDRESSES[chainId as SupportedChainId];

        if (contractAddress === '0x0000000000000000000000000000000000000000') {
            throw new Error('Contract not deployed on this network');
        }

        writeContract({
            address: contractAddress as `0x${string}`,
            abi: MUSIC_NFT_ABI,
            functionName: 'mint',
            args: [address, tokenURI],
        });
    };

    return {
        mint,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
