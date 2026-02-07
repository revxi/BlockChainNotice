# Migration to Polygon Mainnet

This guide explains how to deploy the contract to Polygon Mainnet (or Arbitrum) and configure the frontend.

## Prerequisites

1.  **RPC URL**: Get a free RPC URL from [Alchemy](https://www.alchemy.com/), [Infura](https://infura.io/), or use a public one like `https://polygon-rpc.com`.
2.  **Private Key**: Export your private key from MetaMask (Settings -> Security & Privacy -> Show Private Key). **Do not commit this key to Git.**
3.  **MATIC**: Ensure your wallet has MATIC on the Polygon Mainnet for gas fees.

## Step 1: Configure Environment Variables

1.  Edit the `.env` file in the root directory:
    ```bash
    POLYGON_RPC_URL=https://polygon-rpc.com
    PRIVATE_KEY=your_private_key_here
    ```

## Step 2: Deploy Contract

Run the deployment script for the Polygon network:

```bash
npx hardhat run blockchain/scripts/deploy.cjs --network polygon
```

For Arbitrum:

```bash
npx hardhat run blockchain/scripts/deploy.cjs --network arbitrum
```

The script will output the deployed contract address:
`✅ BlockNotice deployed to: 0x...`

## Step 3: Update Frontend Configuration

1.  Copy the new contract address.
2.  Edit `frontend/.env` to configure the contract address and network settings. You can use `frontend/.env.example` (if provided) or create a new file:

    ```bash
    VITE_CONTRACT_ADDRESS=0xYourNewContractAddress
    VITE_CHAIN_ID=0x89
    VITE_RPC_URL=https://polygon-rpc.com
    VITE_CHAIN_NAME="Polygon Mainnet"
    VITE_NATIVE_CURRENCY_SYMBOL=MATIC
    VITE_BLOCK_EXPLORER_URL=https://polygonscan.com/
    ```

    For Arbitrum One, use:
    ```bash
    VITE_CHAIN_ID=0xA4B1 # 42161
    VITE_RPC_URL=https://arb1.arbitrum.io/rpc
    VITE_CHAIN_NAME="Arbitrum One"
    VITE_NATIVE_CURRENCY_SYMBOL=ETH
    VITE_BLOCK_EXPLORER_URL=https://arbiscan.io/
    ```

3.  Restart the frontend server:
    ```bash
    cd frontend
    npm run dev
    ```

## Step 4: Verification

1.  Open the frontend.
2.  Connect your wallet.
3.  The app should prompt you to switch to Polygon Mainnet if not already connected.
4.  Interact with the app (post a notice) to verify the transaction works on Polygon.
