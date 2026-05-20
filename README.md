# BlockNotice

**A Decentralized Official Notice Board powered by the Ethereum Blockchain**

BlockNotice is a dApp (decentralized application) that enables colleges and institutions to publish tamper-proof official notices on the Ethereum blockchain. Notices are immutable, verifiable, and always available — no central server required.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Smart Contract Setup](#smart-contract-setup)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Security](#security)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)
- [License](#license)

---

## Overview

Traditional notice boards rely on centralized servers that are vulnerable to data tampering, unauthorized modifications, and downtime. BlockNotice replaces this with a blockchain-backed system where:

- Every notice is recorded permanently on-chain
- Only authorized administrators can publish
- Anyone can read and verify notices without trusting a central server
- Content integrity is guaranteed through IPFS-style content hashing

---

## Key Features

| Feature | Description |
|---|---|
| **Immutable Records** | Notices are stored on-chain and cannot be edited or deleted after publishing |
| **Admin-Only Publishing** | Smart contract enforces that only the authorized admin wallet can post |
| **IPFS Content Hashing** | Notice content is hashed before submission, simulating decentralized file storage |
| **Wallet Authentication** | MetaMask and any EIP-1193 wallet are supported for admin login |
| **Real-Time Blockchain Reads** | Notices are fetched directly from the contract — no backend database |
| **Search & Filter** | Search notices by title, ID, or publication date |
| **Professional UI** | Clean, institutional design suitable for college official use |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contracts** | Solidity, Hardhat |
| **Frontend Framework** | React 18, Vite, Tailwind CSS |
| **Blockchain Interaction** | Wagmi v3, Viem v2, ethers.js v6 |
| **State Management** | TanStack React Query |
| **Wallet Support** | MetaMask, any injected EIP-1193 wallet |
| **Storage (Simulated)** | IPFS content addressing (SHA-256 hashing) |
| **Networks Supported** | Ethereum Mainnet, Sepolia Testnet, Polygon |

---

## Project Structure

```
BlockChainNotice/
├── frontend/                    # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Login page (Student / Admin tabs)
│   │   │   ├── AdminPanel.jsx   # Admin notice publishing form
│   │   │   ├── NoticeFeed.jsx   # Notice grid with empty states
│   │   │   └── NoticeCard.jsx   # Individual notice card
│   │   ├── utils/
│   │   │   ├── abi.json         # Smart contract ABI
│   │   │   ├── connectors.js    # Wallet connector helpers
│   │   │   └── ipfs.js          # IPFS content hashing utility
│   │   ├── wagmi.jsx            # Wagmi configuration
│   │   ├── App.jsx              # Main application logic
│   │   └── main.jsx             # React entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── blockchain/                  # Hardhat smart contract workspace
│   ├── contracts/
│   │   └── BlockNotice.sol      # Main smart contract
│   ├── scripts/
│   │   └── deploy.cjs           # Deployment script
│   ├── test/
│   │   └── BlockNotice.test.cjs # Contract test suite
│   └── hardhat.config.cjs
│
├── backend/                     # Optional Node.js/Express backend
│   └── package.json
│
├── scripts/
│   └── post-merge.sh            # CI post-merge dependency installer
│
├── contract.js                  # Shared contract address utility
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MetaMask** browser extension (or any EIP-1193 wallet)
- **Hardhat** (installed as a dev dependency in `blockchain/`)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/revxi/BlockChainNotice.git
cd BlockChainNotice

# Install and run the frontend
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5000`.

### Smart Contract Setup

```bash
cd blockchain
npm install

# Compile the contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Deploy to a local network
npx hardhat node
npx hardhat run scripts/deploy.cjs --network localhost

# Deploy to a testnet (e.g. Sepolia)
npx hardhat run scripts/deploy.cjs --network sepolia
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
VITE_BACKEND_URL=http://localhost:3001/api
```

> **Note:** After deploying the smart contract, copy the deployed address into `VITE_CONTRACT_ADDRESS`. You also need to update `CONTRACT_ADDRESS` in `frontend/src/App.jsx` and `frontend/src/components/Login.jsx`.

---

## Usage

### As a Student / Viewer

1. Open the app and click **View Notice Board**
2. Browse all official notices published on the blockchain
3. Use the search bar to filter by notice title, ID, or date
4. No wallet required for read-only access

### As an Administrator

1. Click the **Administrator** tab on the login screen
2. Click **Connect Admin Wallet** — MetaMask will prompt for connection
3. The smart contract verifies your wallet matches the registered admin address
4. Use the **Issue Official Notice** panel to publish new notices
5. Each published notice is permanently recorded on-chain

---

## Smart Contract

The `BlockNotice.sol` contract provides the following interface:

| Function | Access | Description |
|---|---|---|
| `postNotice(title, content)` | Admin only | Publishes a new notice to the chain |
| `getAllNotices()` | Public | Returns all published notices |
| `admin()` | Public | Returns the admin wallet address |

**Notice structure:**
```solidity
struct Notice {
    uint256 id;
    string title;
    string content;   // IPFS-style content hash
    uint256 timestamp;
}
```

---

## Security

- **On-chain admin verification** — the frontend verifies the connected wallet against the contract's `admin()` state before allowing any publish action
- **Immutable records** — published notices cannot be modified or deleted by anyone, including the admin
- **Content hashing** — notice content is hashed using SHA-256 (IPFS simulation) before being stored, enabling integrity verification
- **No private keys stored** — all signing happens in the user's wallet; the app never handles private keys

---

## Future Enhancements

- [ ] Real IPFS integration (Pinata / Web3.storage) for file attachments
- [ ] Role-based access (multiple admins, department roles)
- [ ] Email / push notifications for new notices
- [ ] Testnet deployment (Sepolia) with public contract verification on Etherscan
- [ ] Notice categories and advanced filtering
- [ ] Mobile-responsive PWA version
- [ ] Multi-institution support

---

## Contributors

| Name |
|---|
| Diksha Singh |
| Nandani Rana |
| Mehak Sharma |
| Yukta Lohani |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
