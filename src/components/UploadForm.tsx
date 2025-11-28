'use client'

import { useState, useCallback, useEffect } from 'react';
import { ipfsStorage, type MusicMetadata } from '@/lib/ipfs';
import { useAccount } from 'wagmi';
import { useMintMusic } from '@/hooks/useMintMusic';
import { useToast } from '@/context/ToastContext';
import { useNetworkCheck } from '@/hooks/useNetworkCheck';
import { useGasEstimate } from '@/hooks/useGasEstimate';
import NetworkSwitcher from './NetworkSwitcher';
import MintButton from './MintButton';
import TransactionStatus from './TransactionStatus';

interface UploadState {
    audioFile: File | null;
    coverFile: File | null;
    title: string;
    artist: string;
    description: string;
    isUploading: boolean;
    uploadProgress: string;
    error: string | null;
    success: boolean;
    tokenURI: string | null;
}

export default function UploadForm() {
    const { address, isConnected } = useAccount();
    const { isReady: isNetworkReady, networkName } = useNetworkCheck();
    const { mint, hash, isPending, isConfirming, isSuccess: isMinted, error: mintError } = useMintMusic();
    const toast = useToast();
    const [state, setState] = useState<UploadState>({
        audioFile: null,
        coverFile: null,
        title: '',
        artist: '',
        description: '',
        isUploading: false,
        uploadProgress: '',
        error: null,
        success: false,
        tokenURI: null,
    });

    const [audioDragActive, setAudioDragActive] = useState(false);
    const [coverDragActive, setCoverDragActive] = useState(false);
    const { formattedEstimate } = useGasEstimate(state.tokenURI, address);

    useEffect(() => {
        if (isMinted && hash) {
            toast.success('NFT minted successfully!');
        }
    }, [isMinted, hash, toast]);

    useEffect(() => {
        if (mintError) {
            toast.error(mintError.message || 'Failed to mint NFT');
        }
    }, [mintError, toast]);

    const handleAudioDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setAudioDragActive(true);
        } else if (e.type === 'dragleave') {
            setAudioDragActive(false);
        }
    }, []);

    const handleCoverDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setCoverDragActive(true);
        } else if (e.type === 'dragleave') {
            setCoverDragActive(false);
        }
    }, []);

    const handleAudioDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAudioDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            setState(prev => ({ ...prev, audioFile: file, error: null }));
        } else {
            setState(prev => ({ ...prev, error: 'Please upload a valid audio file' }));
        }
    }, []);

    const handleCoverDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCoverDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setState(prev => ({ ...prev, coverFile: file, error: null }));
        } else {
            setState(prev => ({ ...prev, error: 'Please upload a valid image file' }));
        }
    }, []);

    const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            setState(prev => ({ ...prev, audioFile: file, error: null }));
        }
    };

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setState(prev => ({ ...prev, coverFile: file, error: null }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            setState(prev => ({ ...prev, error: 'Please connect your wallet first' }));
            return;
        }

        if (!state.audioFile || !state.coverFile || !state.title || !state.artist) {
            setState(prev => ({ ...prev, error: 'Please fill in all required fields' }));
            return;
        }

        setState(prev => ({ ...prev, isUploading: true, error: null, uploadProgress: 'Uploading audio file...' }));

        try {
            // Upload audio file
            const audioResult = await ipfsStorage.uploadFile(state.audioFile);
            setState(prev => ({ ...prev, uploadProgress: 'Uploading cover art...' }));

            // Upload cover art
            const coverResult = await ipfsStorage.uploadFile(state.coverFile);
            setState(prev => ({ ...prev, uploadProgress: 'Creating metadata...' }));

            // Create and upload metadata
            const metadata: MusicMetadata = {
                name: state.title,
                description: state.description,
                artist: state.artist,
                image: `ipfs://${coverResult.ipfsHash}`,
                audio: `ipfs://${audioResult.ipfsHash}`,
                attributes: [
                    {
                        trait_type: 'Artist',
                        value: state.artist,
                    },
                    {
                        trait_type: 'Type',
                        value: 'Music NFT',
                    },
                ],
            };

            const metadataResult = await ipfsStorage.uploadJSON(metadata);
            const tokenURI = `ipfs://${metadataResult.ipfsHash}`;

            setState(prev => ({
                ...prev,
                isUploading: false,
                success: true,
                tokenURI,
                uploadProgress: 'Upload complete!',
            }));
        } catch (error) {
            console.error('Upload error:', error);
            setState(prev => ({
                ...prev,
                isUploading: false,
                error: error instanceof Error ? error.message : 'Failed to upload files',
                uploadProgress: '',
            }));
        }
    };

    if (!isConnected) {
        return (
            <div className="glass rounded-2xl p-8 text-center">
                <p className="text-[var(--muted-foreground)]">Please connect your wallet to upload music</p>
            </div>
        );
    }

    if (!isNetworkReady) {
        return (
            <div className="space-y-4">
                <div className="glass rounded-2xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold">Wrong Network</h3>
                    <p className="text-[var(--muted-foreground)]">
                        You're currently on {networkName}. Please switch to a supported network to upload music.
                    </p>
                </div>
                <NetworkSwitcher />
            </div>
        );
    }

    if (state.success && state.tokenURI) {
        return (
            <div className="glass rounded-2xl p-8 space-y-6 animate-fade-in">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold gradient-text">Upload Successful!</h3>
                    <p className="text-[var(--muted-foreground)]">Your music has been uploaded to IPFS</p>
                    <div className="p-4 rounded-lg bg-[var(--muted)] text-sm font-mono break-all">
                        {state.tokenURI}
                    </div>
                </div>

                {/* Minting Section */}
                <div className="space-y-4">
                    <MintButton
                        onClick={() => state.tokenURI && mint(state.tokenURI)}
                        disabled={!state.tokenURI || isPending || isConfirming || isMinted}
                        isLoading={isPending || isConfirming}
                        gasEstimate={formattedEstimate || undefined}
                    >
                        {isMinted ? 'Minted Successfully!' : 'Mint as NFT'}
                    </MintButton>

                    <TransactionStatus
                        hash={hash}
                        isPending={isPending}
                        isConfirming={isConfirming}
                        isSuccess={isMinted}
                        error={mintError}
                    />
                </div>

                <button
                    onClick={() => setState({
                        audioFile: null,
                        coverFile: null,
                        title: '',
                        artist: '',
                        description: '',
                        isUploading: false,
                        uploadProgress: '',
                        error: null,
                        success: false,
                        tokenURI: null,
                    })}
                    className="w-full px-6 py-3 rounded-full glass text-[var(--foreground)] font-semibold hover:bg-[var(--muted)] transition-all"
                >
                    Upload Another Track
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 md:p-8 space-y-4 md:space-y-6">
            {/* Audio File Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">Audio File *</label>
                <div
                    onDragEnter={handleAudioDrag}
                    onDragLeave={handleAudioDrag}
                    onDragOver={handleAudioDrag}
                    onDrop={handleAudioDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${audioDragActive
                        ? 'border-[hsl(280,80%,60%)] bg-[hsl(280,80%,60%)]/10'
                        : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                        }`}
                >
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={state.isUploading}
                    />
                    {state.audioFile ? (
                        <div className="space-y-2">
                            <div className="text-2xl">🎵</div>
                            <p className="font-medium">{state.audioFile.name}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                                {(state.audioFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-4xl">📁</div>
                            <p className="font-medium">Drag & drop your audio file here</p>
                            <p className="text-sm text-[var(--muted-foreground)]">or click to browse</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cover Art Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">Cover Art *</label>
                <div
                    onDragEnter={handleCoverDrag}
                    onDragLeave={handleCoverDrag}
                    onDragOver={handleCoverDrag}
                    onDrop={handleCoverDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${coverDragActive
                        ? 'border-[hsl(280,80%,60%)] bg-[hsl(280,80%,60%)]/10'
                        : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={state.isUploading}
                    />
                    {state.coverFile ? (
                        <div className="space-y-2">
                            <div className="text-2xl">🖼️</div>
                            <p className="font-medium">{state.coverFile.name}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                                {(state.coverFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-4xl">🎨</div>
                            <p className="font-medium">Drag & drop cover art here</p>
                            <p className="text-sm text-[var(--muted-foreground)]">or click to browse</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Track Title *</label>
                    <input
                        type="text"
                        value={state.title}
                        onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-[hsl(280,80%,60%)] focus:outline-none transition-colors"
                        placeholder="Enter track title"
                        disabled={state.isUploading}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Artist Name *</label>
                    <input
                        type="text"
                        value={state.artist}
                        onChange={(e) => setState(prev => ({ ...prev, artist: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-[hsl(280,80%,60%)] focus:outline-none transition-colors"
                        placeholder="Enter artist name"
                        disabled={state.isUploading}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    value={state.description}
                    onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-[hsl(280,80%,60%)] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your track..."
                    rows={4}
                    disabled={state.isUploading}
                />
            </div>

            {/* Error Message */}
            {state.error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
                    {state.error}
                </div>
            )}

            {/* Upload Progress */}
            {state.isUploading && (
                <div className="p-4 rounded-lg bg-[hsl(280,80%,60%)]/10 border border-[hsl(280,80%,60%)]/50">
                    <p className="text-center text-[hsl(280,80%,60%)]">{state.uploadProgress}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={state.isUploading}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-[hsl(263,70%,50%)] to-[hsl(280,80%,60%)] text-white font-semibold hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {state.isUploading ? 'Uploading...' : 'Upload to IPFS'}
            </button>
        </form>
    );
}
