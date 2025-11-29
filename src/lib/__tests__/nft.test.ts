import { describe, it, expect } from 'vitest'
import { formatTokenId, getImageUrl, getAudioUrl, getExplorerUrl } from '@/lib/nft'
import type { NFTMetadata } from '@/types/metadata'

describe('NFT Utility Functions', () => {
    describe('formatTokenId', () => {
        it('should format token ID with leading zeros', () => {
            expect(formatTokenId(BigInt(1))).toBe('#0001')
            expect(formatTokenId(BigInt(42))).toBe('#0042')
            expect(formatTokenId(BigInt(999))).toBe('#0999')
            expect(formatTokenId(BigInt(1000))).toBe('#1000')
        })

        it('should handle large token IDs', () => {
            expect(formatTokenId(BigInt(99999))).toBe('#99999')
        })
    })

    describe('getImageUrl', () => {
        it('should return image URL from metadata', () => {
            const metadata: NFTMetadata = {
                name: 'Test',
                image: 'ipfs://QmTest123',
            }
            expect(getImageUrl(metadata)).toBe('ipfs://QmTest123')
        })

        it('should return undefined for missing image', () => {
            const metadata: NFTMetadata = {
                name: 'Test',
            }
            expect(getImageUrl(metadata)).toBeUndefined()
        })

        it('should handle null metadata', () => {
            expect(getImageUrl(null)).toBeUndefined()
        })
    })

    describe('getAudioUrl', () => {
        it('should return audio URL from metadata', () => {
            const metadata: NFTMetadata = {
                name: 'Test',
                audio: 'ipfs://QmAudio123',
            }
            expect(getAudioUrl(metadata)).toBe('ipfs://QmAudio123')
        })

        it('should return undefined for missing audio', () => {
            const metadata: NFTMetadata = {
                name: 'Test',
            }
            expect(getAudioUrl(metadata)).toBeUndefined()
        })

        it('should handle null metadata', () => {
            expect(getAudioUrl(null)).toBeUndefined()
        })
    })

    describe('getExplorerUrl', () => {
        it('should return Sepolia Etherscan URL for Sepolia chain', () => {
            const url = getExplorerUrl('0x123', BigInt(1), 11155111)
            expect(url).toContain('sepolia.etherscan.io')
            expect(url).toContain('0x123')
            expect(url).toContain('1')
        })

        it('should return mainnet Etherscan URL for mainnet chain', () => {
            const url = getExplorerUrl('0x456', BigInt(2), 1)
            expect(url).toContain('etherscan.io')
            expect(url).not.toContain('sepolia')
            expect(url).toContain('0x456')
            expect(url).toContain('2')
        })

        it('should handle undefined metadata URL', () => {
            const url = getExplorerUrl('0x789', BigInt(3), 11155111, undefined)
            expect(url).toContain('sepolia.etherscan.io')
            expect(url).toContain('0x789')
        })
    })
})
