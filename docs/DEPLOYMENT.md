# Deployment Guide

This guide covers deploying Cuddly Disco to production.

## Prerequisites

- Deployed Music NFT smart contract
- Reown Project ID
- Pinata account with API credentials
- Vercel or Netlify account

## Environment Setup

### 1. Get Reown Project ID

1. Visit [cloud.reown.com](https://cloud.reown.com)
2. Create a new project
3. Copy your Project ID

### 2. Get Pinata Credentials

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Go to API Keys
3. Create a new API key with pinning permissions
4. Save your JWT token or API key/secret

### 3. Deploy Smart Contract

Deploy the Music NFT contract to your chosen network(s):

```solidity
// Example: Deploy to Sepolia testnet
// Update src/contracts/MusicNFT.ts with the deployed address
```

## Deployment to Vercel

### Option 1: Deploy via CLI

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_PROJECT_ID
vercel env add NEXT_PUBLIC_PINATA_JWT

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_PROJECT_ID`
   - `NEXT_PUBLIC_PINATA_JWT`
5. Deploy

## Deployment to Netlify

### Via Netlify CLI

```bash
# Install Netlify CLI
bun add -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Set environment variables
netlify env:set NEXT_PUBLIC_PROJECT_ID your_project_id
netlify env:set NEXT_PUBLIC_PINATA_JWT your_jwt

# Deploy
netlify deploy --prod
```

### Via Netlify UI

1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Import repository
4. Build settings:
   - Build command: `bun run build`
   - Publish directory: `.next`
5. Add environment variables
6. Deploy

## Post-Deployment

### 1. Update Contract Addresses

Update `src/contracts/MusicNFT.ts` with your deployed contract addresses:

```typescript
export const MUSIC_NFT_ADDRESSES = {
  1: '0xYourMainnetAddress',
  42161: '0xYourArbitrumAddress',
  11155111: '0xYourSepoliaAddress',
}
```

### 2. Configure Domain

- Set up custom domain in Vercel/Netlify
- Update Reown project settings with your domain
- Update metadata URLs if needed

### 3. Test

- Connect wallet
- Upload a test track
- Mint an NFT
- View in profile
- Test on mobile

## Monitoring

### Vercel Analytics

Enable analytics in Vercel dashboard for:
- Page views
- Performance metrics
- Error tracking

### Error Tracking

Consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- Mixpanel for user analytics

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Smart contract is verified on block explorer
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] SSL/TLS is active
- [ ] API keys are not exposed in client code

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
bun install
bun run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables
- Check variable names match exactly

### IPFS Upload Failures

- Verify Pinata credentials
- Check API rate limits
- Ensure files are under size limits

## Support

For issues, please:
1. Check the [GitHub Issues](https://github.com/Jujujulex/cuddly-disco/issues)
2. Join our Discord community
3. Contact support@cuddlydisco.com
