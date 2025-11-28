// NFT Metadata Type Definitions
// Following ERC-721 and OpenSea metadata standards

export interface NFTAttribute {
    trait_type: string;
    value: string | number;
    display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
}

export interface NFTMetadata {
    // Core ERC-721 fields
    name: string;
    description: string;
    image: string;

    // Music-specific fields
    artist: string;
    audio: string;

    // OpenSea extended fields
    external_url?: string;
    animation_url?: string;
    background_color?: string;

    // Attributes/Properties
    attributes?: NFTAttribute[];
    properties?: {
        [key: string]: string | number | boolean;
    };
}

export interface TokenData {
    tokenId: bigint;
    tokenURI: string;
    owner: string;
    metadata?: NFTMetadata;
}

export interface UserNFTCollection {
    tokens: TokenData[];
    totalCount: number;
    isLoading: boolean;
    error: Error | null;
}

export interface IPFSMetadata extends NFTMetadata {
    // IPFS-specific fields
    ipfsHash?: string;
    pinataMetadata?: {
        name: string;
        keyvalues?: Record<string, string>;
    };
}

// Validation types
export type MetadataValidationError = {
    field: string;
    message: string;
};

export interface MetadataValidationResult {
    isValid: boolean;
    errors: MetadataValidationError[];
}
