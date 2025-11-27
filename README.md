# Cuddly Disco 🎵

An onchain music platform where artists can upload, mint, and share their music as NFTs.

## Features

- 🔐 **Web3 Authentication** - Connect with wallet or social logins (Reown AppKit)
- 📤 **IPFS Upload** - Upload audio files and cover art to decentralized storage
- 🎨 **NFT Minting** - Mint your music as NFTs on-chain
- 🎧 **Audio Player** - Built-in player for your music NFTs
- 👤 **User Profiles** - View your NFT collection
- 🌈 **Premium UI** - Beautiful gradients, glassmorphism, and animations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Package Manager**: Bun
- **Styling**: TailwindCSS 4
- **Web3**: Reown AppKit, Wagmi, Viem
- **Storage**: IPFS (Pinata)
- **Smart Contract**: ERC-721

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- Reown Project ID from [cloud.reown.com](https://cloud.reown.com)
- Pinata account for IPFS storage

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jujujulex/cuddly-disco.git
cd cuddly-disco
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Smart Contract Setup

The platform requires a deployed Music NFT contract (ERC-721). Update the contract addresses in `src/contracts/MusicNFT.ts`:

```typescript
export const MUSIC_NFT_ADDRESSES = {
  1: '0xYourMainnetAddress',
  42161: '0xYourArbitrumAddress',
  11155111: '0xYourSepoliaAddress',
}
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── config/           # Reown AppKit configuration
├── context/          # React context providers
├── contracts/        # Smart contract ABIs
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PROJECT_ID` | Reown Cloud Project ID | Yes |
| `NEXT_PUBLIC_PINATA_JWT` | Pinata JWT token | Yes* |
| `NEXT_PUBLIC_PINATA_API_KEY` | Pinata API key | Yes* |
| `NEXT_PUBLIC_PINATA_SECRET_KEY` | Pinata secret key | Yes* |

*Use either JWT or API key/secret pair

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
