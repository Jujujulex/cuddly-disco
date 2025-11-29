import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AudioProvider, useAudio } from '@/context/AudioContext'
import type { TokenData } from '@/types/metadata'

// Mock token data
const mockTrack1: TokenData = {
    tokenId: BigInt(1),
    tokenURI: 'ipfs://test1',
    owner: '0x123',
    metadata: {
        name: 'Test Track 1',
        description: 'A test track',
        image: 'ipfs://image1',
        audio: 'ipfs://audio1',
        artist: 'Test Artist',
        properties: {
            genre: 'Electronic',
            duration: 180,
        },
    },
}

const mockTrack2: TokenData = {
    tokenId: BigInt(2),
    tokenURI: 'ipfs://test2',
    owner: '0x456',
    metadata: {
        name: 'Test Track 2',
        description: 'Another test track',
        image: 'ipfs://image2',
        audio: 'ipfs://audio2',
        artist: 'Test Artist 2',
        properties: {
            genre: 'Rock',
            duration: 200,
        },
    },
}

describe('useAudio', () => {
    beforeEach(() => {
        // Mock HTMLAudioElement
        global.HTMLAudioElement.prototype.play = vi.fn(() => Promise.resolve())
        global.HTMLAudioElement.prototype.pause = vi.fn()
    })

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        expect(result.current.currentTrack).toBeNull()
        expect(result.current.isPlaying).toBe(false)
        expect(result.current.queue).toEqual([])
        expect(result.current.volume).toBe(0.8)
        expect(result.current.isShuffle).toBe(false)
        expect(result.current.isRepeat).toBe(false)
    })

    it('should play a track', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.playTrack(mockTrack1)
        })

        expect(result.current.currentTrack).toEqual(mockTrack1)
        expect(result.current.isPlaying).toBe(true)
        expect(result.current.queue).toContainEqual(mockTrack1)
    })

    it('should toggle play/pause', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.playTrack(mockTrack1)
        })

        expect(result.current.isPlaying).toBe(true)

        act(() => {
            result.current.togglePlay()
        })

        expect(result.current.isPlaying).toBe(false)

        act(() => {
            result.current.togglePlay()
        })

        expect(result.current.isPlaying).toBe(true)
    })

    it('should add tracks to queue', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.addToQueue(mockTrack1)
            result.current.addToQueue(mockTrack2)
        })

        expect(result.current.queue).toHaveLength(2)
        expect(result.current.queue).toContainEqual(mockTrack1)
        expect(result.current.queue).toContainEqual(mockTrack2)
    })

    it('should remove tracks from queue', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.addToQueue(mockTrack1)
            result.current.addToQueue(mockTrack2)
        })

        expect(result.current.queue).toHaveLength(2)

        act(() => {
            result.current.removeFromQueue('1')
        })

        expect(result.current.queue).toHaveLength(1)
        expect(result.current.queue).not.toContainEqual(mockTrack1)
        expect(result.current.queue).toContainEqual(mockTrack2)
    })

    it('should change volume', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.setVolume(0.5)
        })

        expect(result.current.volume).toBe(0.5)
    })

    it('should toggle shuffle', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        expect(result.current.isShuffle).toBe(false)

        act(() => {
            result.current.toggleShuffle()
        })

        expect(result.current.isShuffle).toBe(true)

        act(() => {
            result.current.toggleShuffle()
        })

        expect(result.current.isShuffle).toBe(false)
    })

    it('should toggle repeat', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        expect(result.current.isRepeat).toBe(false)

        act(() => {
            result.current.toggleRepeat()
        })

        expect(result.current.isRepeat).toBe(true)

        act(() => {
            result.current.toggleRepeat()
        })

        expect(result.current.isRepeat).toBe(false)
    })

    it('should play next track in queue', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.playTrack(mockTrack1)
            result.current.addToQueue(mockTrack2)
        })

        expect(result.current.currentTrack).toEqual(mockTrack1)

        act(() => {
            result.current.nextTrack()
        })

        expect(result.current.currentTrack).toEqual(mockTrack2)
    })

    it('should play previous track in queue', () => {
        const { result } = renderHook(() => useAudio(), {
            wrapper: AudioProvider,
        })

        act(() => {
            result.current.playTrack(mockTrack1)
            result.current.addToQueue(mockTrack2)
            result.current.nextTrack()
        })

        expect(result.current.currentTrack).toEqual(mockTrack2)

        act(() => {
            result.current.previousTrack()
        })

        expect(result.current.currentTrack).toEqual(mockTrack1)
    })
})
