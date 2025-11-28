import type { TokenData, NFTMetadata } from '@/types/metadata';
import { fetchMetadataFromURI, batchFetchMetadata } from './metadata';

/**
 * Fetch NFT data including metadata for a single token
 */
export async function fetchNFTData(tokenData: TokenData): Promise<TokenData> {
    try {
        const metadata = await fetchMetadataFromURI(tokenData.tokenURI);
        return {
            ...tokenData,
            metadata: metadata || undefined,
        };
    } catch (error) {
        console.error(`Error fetching NFT data for token ${tokenData.tokenId}:`, error);
        return tokenData;
    }
}

/**
 * Batch fetch NFT data for multiple tokens
 */
export async function batchFetchNFTData(tokens: TokenData[]): Promise<TokenData[]> {
    const tokenURIs = tokens.map(t => t.tokenURI);
    const metadataList = await batchFetchMetadata(tokenURIs);

    return tokens.map((token, index) => ({
        ...token,
        metadata: metadataList[index] || undefined,
    }));
}

/**
 * Get audio URL from metadata (handles IPFS and HTTP)
 */
export function getAudioUrl(metadata: NFTMetadata | undefined): string | null {
    if (!metadata?.audio) return null;

    // Handle IPFS URLs
    if (metadata.audio.startsWith('ipfs://')) {
        const hash = metadata.audio.replace('ipfs://', '');
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }

    // Handle HTTP/HTTPS URLs
    if (metadata.audio.startsWith('http://') || metadata.audio.startsWith('https://')) {
        return metadata.audio;
    }

    return null;
}

/**
 * Get image URL from metadata (handles IPFS and HTTP)
 */
export function getImageUrl(metadata: NFTMetadata | undefined): string | null {
    if (!metadata?.image) return null;

    // Handle IPFS URLs
    if (metadata.image.startsWith('ipfs://')) {
        const hash = metadata.image.replace('ipfs://', '');
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }

    // Handle HTTP/HTTPS URLs
    if (metadata.image.startsWith('http://') || metadata.image.startsWith('https://')) {
        return metadata.image;
    }

    return null;
}

/**
 * Format token ID for display
 */
export function formatTokenId(tokenId: bigint): string {
    return `#${tokenId.toString()}`;
}

/**
 * Get explorer URL for token
 */
export function getExplorerUrl(chainId: number, contractAddress: string, tokenId: bigint): string {
    const explorers: Record<number, string> = {
        1: 'https://etherscan.io',
        42161: 'https://arbiscan.io',
        11155111: 'https://sepolia.etherscan.io',
    };

    const baseUrl = explorers[chainId] || 'https://etherscan.io';
    return `${baseUrl}/token/${contractAddress}?a=${tokenId}`;
}
