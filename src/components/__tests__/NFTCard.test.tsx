import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import NFTCard from '@/components/NFTCard'
import type { TokenData } from '@/types/metadata'
import { AudioProvider } from '@/context/AudioContext'
import { PlaylistProvider } from '@/context/PlaylistContext'

// Mock the hooks
vi.mock('@/hooks/useLikes', () => ({
    useLikes: () => ({
        isLiked: vi.fn(() => false),
        toggleLike: vi.fn(),
        likedTokenIds: [],
    }),
}))

const mockTokenData: TokenData = {
    tokenId: BigInt(1),
    tokenURI: 'ipfs://test',
    owner: '0x123',
    metadata: {
        name: 'Test Track',
        description: 'A test music NFT',
        image: 'ipfs://image',
        audio: 'ipfs://audio',
        artist: 'Test Artist',
        properties: {
            genre: 'Electronic',
            duration: 180,
        },
    },
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AudioProvider>
        <PlaylistProvider>
            {children}
        </PlaylistProvider>
    </AudioProvider>
)

describe('NFTCard', () => {
    it('should render track name and artist', () => {
        const { getByText } = render(<NFTCard tokenData={mockTokenData} chainId={11155111} />, {
            wrapper: Wrapper,
        })

        expect(getByText('Test Track')).toBeInTheDocument()
        expect(getByText('Test Artist')).toBeInTheDocument()
    })

    it('should render description if provided', () => {
        const { getByText } = render(<NFTCard tokenData={mockTokenData} chainId={11155111} />, {
            wrapper: Wrapper,
        })

        expect(getByText('A test music NFT')).toBeInTheDocument()
    })

    it('should render genre badge', () => {
        const { getByText } = render(<NFTCard tokenData={mockTokenData} chainId={11155111} />, {
            wrapper: Wrapper,
        })

        expect(getByText('Electronic')).toBeInTheDocument()
    })

    it('should show loading state when metadata is missing', () => {
        const tokenWithoutMetadata: TokenData = {
            tokenId: BigInt(1),
            tokenURI: 'ipfs://test',
            owner: '0x123',
            metadata: undefined,
        }

        const { getByText } = render(<NFTCard tokenData={tokenWithoutMetadata} chainId={11155111} />, {
            wrapper: Wrapper,
        })

        expect(getByText(/Loading metadata/i)).toBeInTheDocument()
    })

    it('should render Actions button', () => {
        const { getByText } = render(<NFTCard tokenData={mockTokenData} chainId={11155111} />, {
            wrapper: Wrapper,
        })

        expect(getByText('Actions')).toBeInTheDocument()
    })
})
