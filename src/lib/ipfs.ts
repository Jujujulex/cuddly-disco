// IPFS Storage Service
// This service handles uploading files to IPFS via Pinata

export interface IPFSUploadResult {
    ipfsHash: string;
    pinSize: number;
    timestamp: string;
}

export interface MusicMetadata {
    // Core ERC-721 fields
    name: string;
    description: string;
    image: string; // IPFS hash of cover art

    // Music-specific fields
    artist: string;
    audio: string; // IPFS hash of audio file

    // OpenSea extended fields
    external_url?: string; // URL to view the item on your site
    animation_url?: string; // URL to a multimedia attachment (could be audio URL)
    background_color?: string; // Six-character hexadecimal without #

    // Attributes for OpenSea properties
    attributes?: Array<{
        trait_type: string;
        value: string | number;
        display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
    }>;

    // Additional properties
    properties?: {
        artist?: string;
        duration?: number;
        genre?: string;
        bpm?: number;
        [key: string]: string | number | boolean | undefined;
    };
}

class IPFSStorageService {
    private pinataApiKey: string;
    private pinataSecretKey: string;
    private pinataJWT: string | null;

    constructor() {
        this.pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
        this.pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';
        this.pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT || null;
    }

    /**
     * Upload a file to IPFS via Pinata
     */
    async uploadFile(file: File): Promise<IPFSUploadResult> {
        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
            name: file.name,
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 1,
        });
        formData.append('pinataOptions', options);

        try {
            const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload file: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                ipfsHash: data.IpfsHash,
                pinSize: data.PinSize,
                timestamp: data.Timestamp,
            };
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
            throw error;
        }
    }

    /**
     * Upload JSON metadata to IPFS
     */
    async uploadJSON(metadata: MusicMetadata): Promise<IPFSUploadResult> {
        try {
            const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pinataContent: metadata,
                    pinataMetadata: {
                        name: `${metadata.name}-metadata`,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to upload JSON: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                ipfsHash: data.IpfsHash,
                pinSize: data.PinSize,
                timestamp: data.Timestamp,
            };
        } catch (error) {
            console.error('Error uploading JSON to IPFS:', error);
            throw error;
        }
    }

    /**
     * Get IPFS gateway URL
     */
    getGatewayUrl(ipfsHash: string): string {
        return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    }

    /**
     * Get authentication headers
     */
    private getAuthHeaders(): HeadersInit {
        if (this.pinataJWT) {
            return {
                Authorization: `Bearer ${this.pinataJWT}`,
            };
        }
        return {
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretKey,
        };
    }
}

export const ipfsStorage = new IPFSStorageService();
