import type { Metadata } from 'next'

interface GenerateMetadataParams {
    title: string
    description: string
    image?: string
    url?: string
}

export function generateMetadata({
    title,
    description,
    image = '/og-image.png',
    url = 'https://cuddly-disco.vercel.app',
}: GenerateMetadataParams): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            siteName: 'Cuddly Disco',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@cuddlydisco',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    }
}

export function generateNFTMetadata(
    tokenId: string,
    name: string,
    artist: string,
    imageUrl?: string
): Metadata {
    return generateMetadata({
        title: `${name} by ${artist} | Cuddly Disco`,
        description: `Listen to ${name} by ${artist} on Cuddly Disco - The premier music NFT platform`,
        image: imageUrl || '/og-image.png',
        url: `https://cuddly-disco.vercel.app/nft/${tokenId}`,
    })
}

export function generatePlaylistMetadata(
    playlistId: string,
    name: string,
    trackCount: number
): Metadata {
    return generateMetadata({
        title: `${name} | Cuddly Disco Playlist`,
        description: `${name} - A playlist with ${trackCount} track${trackCount !== 1 ? 's' : ''} on Cuddly Disco`,
        url: `https://cuddly-disco.vercel.app/playlist/${playlistId}`,
    })
}
