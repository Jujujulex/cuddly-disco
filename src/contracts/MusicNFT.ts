// Music NFT Contract ABI
// This is a simplified ERC-721 interface for minting music NFTs

export const MUSIC_NFT_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'string',
                name: 'tokenURI',
                type: 'string',
            },
        ],
        name: 'mint',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'tokenURI',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
            },
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

// Contract addresses for different networks
export const MUSIC_NFT_ADDRESSES = {
    // Mainnet
    1: '0x0000000000000000000000000000000000000000', // Replace with actual mainnet address
    // Arbitrum
    42161: '0x0000000000000000000000000000000000000000', // Replace with actual arbitrum address
    // Sepolia (testnet)
    11155111: '0x0000000000000000000000000000000000000000', // Replace with actual sepolia address
} as const;

export type SupportedChainId = keyof typeof MUSIC_NFT_ADDRESSES;
