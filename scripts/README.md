# Rarible Smart Contracts Deployment scripts
This script uses `Mocha` to deploy all the contract to an environment you can specify.

## Environments
* Mockup: Fastest, mostly for development and testing
* Private network: same as the testnet, but for development purposes as it is more flexible
* Testnet: for testing the contract in pre-production conditions
* Mainnet: for production, or real life testing

## Commands
### Deploy to mockup
```bash
npm run deploy-mockup
```

### Deploy to privatenet
```bash
npm run deploy-privatenet
```

### Deploy to testnet
```bash
npm run deploy-testnet
```

### Deploy to mainnet
```bash
npm run deploy-mainnet
```
