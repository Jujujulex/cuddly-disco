import type { NFTMetadata, MetadataValidationResult, MetadataValidationError } from '@/types/metadata';

/**
 * Fetch metadata from IPFS
 */
export async function fetchMetadataFromIPFS(ipfsHash: string): Promise<NFTMetadata | null> {
    try {
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        const response = await fetch(gatewayUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }

        const metadata = await response.json();
        return metadata as NFTMetadata;
    } catch (error) {
        console.error('Error fetching metadata from IPFS:', error);
        return null;
    }
}

/**
 * Fetch metadata from token URI (handles both IPFS and HTTP)
 */
export async function fetchMetadataFromURI(tokenURI: string): Promise<NFTMetadata | null> {
    try {
        // Handle IPFS URIs
        if (tokenURI.startsWith('ipfs://')) {
            const ipfsHash = tokenURI.replace('ipfs://', '');
            return await fetchMetadataFromIPFS(ipfsHash);
        }

        // Handle HTTP/HTTPS URIs
        if (tokenURI.startsWith('http://') || tokenURI.startsWith('https://')) {
            const response = await fetch(tokenURI);
            if (!response.ok) {
                throw new Error(`Failed to fetch metadata: ${response.statusText}`);
            }
            return await response.json() as NFTMetadata;
        }

        // Handle data URIs
        if (tokenURI.startsWith('data:')) {
            const base64Data = tokenURI.split(',')[1];
            const jsonString = atob(base64Data);
            return JSON.parse(jsonString) as NFTMetadata;
        }

        throw new Error('Unsupported URI format');
    } catch (error) {
        console.error('Error fetching metadata from URI:', error);
        return null;
    }
}

/**
 * Validate NFT metadata structure
 */
export function validateMetadata(metadata: unknown): MetadataValidationResult {
    const errors: MetadataValidationError[] = [];

    if (!metadata || typeof metadata !== 'object') {
        return {
            isValid: false,
            errors: [{ field: 'metadata', message: 'Metadata must be an object' }],
        };
    }

    const data = metadata as Partial<NFTMetadata>;

    // Required fields
    if (!data.name || typeof data.name !== 'string') {
        errors.push({ field: 'name', message: 'Name is required and must be a string' });
    }

    if (!data.description || typeof data.description !== 'string') {
        errors.push({ field: 'description', message: 'Description is required and must be a string' });
    }

    if (!data.image || typeof data.image !== 'string') {
        errors.push({ field: 'image', message: 'Image is required and must be a string' });
    }

    // Music-specific fields
    if (!data.artist || typeof data.artist !== 'string') {
        errors.push({ field: 'artist', message: 'Artist is required and must be a string' });
    }

    if (!data.audio || typeof data.audio !== 'string') {
        errors.push({ field: 'audio', message: 'Audio is required and must be a string' });
    }

    // Validate attributes if present
    if (data.attributes) {
        if (!Array.isArray(data.attributes)) {
            errors.push({ field: 'attributes', message: 'Attributes must be an array' });
        } else {
            data.attributes.forEach((attr, index) => {
                if (!attr.trait_type || typeof attr.trait_type !== 'string') {
                    errors.push({
                        field: `attributes[${index}].trait_type`,
                        message: 'Attribute trait_type is required and must be a string',
                    });
                }
                if (attr.value === undefined) {
                    errors.push({
                        field: `attributes[${index}].value`,
                        message: 'Attribute value is required',
                    });
                }
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Convert IPFS hash to gateway URL
 */
export function ipfsHashToUrl(ipfsHash: string): string {
    // Remove ipfs:// prefix if present
    const hash = ipfsHash.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

/**
 * Batch fetch metadata for multiple token URIs
 */
export async function batchFetchMetadata(tokenURIs: string[]): Promise<(NFTMetadata | null)[]> {
    const promises = tokenURIs.map(uri => fetchMetadataFromURI(uri));
    return await Promise.all(promises);
}
