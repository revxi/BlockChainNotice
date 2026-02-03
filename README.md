# 📜 BlockNotice: Decentralized Notice Board

**BlockNotice** is a secure, decentralized application (dApp) for issuing and verifying official notices. By leveraging the Ethereum blockchain, it ensures that all published information is immutable, transparent, and tamper-proof.

## 🚀 Key Features
- **Immutable Ledger**: Notices are stored on-chain and cannot be deleted or altered.
- **Admin Verification**: Only authorized administrators can publish new notices.
- **Modern UI**: A fully accessible, glassmorphism-styled dashboard built with React.
- **Real-time Updates**: Direct blockchain queries ensure users see the latest verified data.

## 📂 Repository Structure

- **[frontend/](./frontend/)**: The React-based user interface.
- **[blockchain/](./blockchain/)**: Smart contracts (Solidity) and deployment scripts (Hardhat).
- **[backend/](./backend/)**: Server-side logic (Work in Progress).
- **[docs/](./docs/)**: Architecture diagrams and documentation.

## 🛠️ Quick Start Guide

### 1. Prerequisites
- Node.js (v16+)
- MetaMask Browser Extension

### 2. Setup Blockchain
Start the local blockchain node:
```bash
cd blockchain
npm install
npx hardhat node
```
*Keep this terminal running.*

In a new terminal, deploy the contract:
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Setup Frontend
Start the web application:
```bash
cd frontend
npm install
npm run dev
```

### 4. Connect
- Open `http://localhost:5173`.
- Connect MetaMask to `Localhost 8545`.
- Import a test account using a private key from the `npx hardhat node` output.
- You are ready to publish and view notices!

## 📖 Documentation
- [System Architecture](./docs/ARCHITECTURE.md)
- [Frontend Guide](./frontend/README.md)
- [Blockchain Guide](./blockchain/README.md)
