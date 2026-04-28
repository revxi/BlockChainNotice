# BlockChainNotice

### Decentralised Blockchain-Based Notice and File Sharing System

## 1. Overview

BlockChainNotice is a decentralized application (dApp) designed to
provide a secure, transparent, and tamper-proof platform for publishing and viewing notices. By leveraging blockchain technology, it ensures that all published information is immutable, making it ideal for organizations, institutions, and communities that require high trust and accountability in their communications.

## 2. Key Features

-   **Immutable Storage**: Notices are securely stored on the blockchain, ensuring they cannot be modified or tampered with after publication.
-   **Smart Contract-Based Authorization**: Strict access control ensures only authorized administrators can publish new notices.
-   **Decentralized File Storage Support**: Integrates simulated IPFS content addressing for secure, content-based hashing.
-   **User-Friendly Interface**: A modern, responsive React frontend built with Vite and Tailwind CSS.
-   **Event-Based Updates**: Real-time interaction with the blockchain.

## 3. Problem Statement

Traditional noticeboard and file-sharing systems rely on centralized servers. These centralized systems are vulnerable to single points of failure, data tampering, unauthorized modifications, and server downtimes. BlockChainNotice addresses these vulnerabilities by decentralizing data storage and utilizing smart contracts for authorization, ensuring that notices cannot be altered or deleted once published.

## 4. System Architecture

| Component | Technology |
| :--- | :--- |
| **Smart Contracts** | Solidity, Hardhat |
| **Frontend** | React.js, Vite, Tailwind CSS |
| **Blockchain Interaction** | Wagmi, Viem |
| **Optional Storage** | IPFS (Simulated) |
| **Runtime Environment** | Node.js |

## 5. Folder Structure

```text
BlockChainNotice/
├── blockchain/
│   ├── contracts/
│   │   └── BlockNotice.sol      # Main smart contract
│   ├── scripts/
│   │   └── deploy.cjs           # Deployment script
│   ├── test/
│   │   └── BlockNotice.test.cjs # Smart contract test suite
│   ├── hardhat.config.cjs       # Hardhat configuration
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components (Login, AdminPanel, NoticeFeed)
│   │   ├── utils/               # Utilities
│   │   ├── App.jsx              # Main application logic
│   │   └── main.jsx             # Entry point
│   ├── .env                     # Network configuration
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── contract.js                  # Shared contract address utility
├── README.md                    # Project documentation
└── LICENSE                      # MIT License
```

## 6. Installation & Setup

### Prerequisites

-   Node.js
-   MetaMask
-   Hardhat

### Steps

```bash
git clone https://github.com/revxi/BlockChainNotice.git
cd BlockChainNotice
```

### Contract Setup

```bash
cd blockchain
npm install
npx hardhat compile
```

### Deploy Contract

```bash
npx hardhat run scripts/deploy.cjs --network <network-name>
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

## 7. Usage Guide

1.  Connect wallet
2.  Admin publishes notices
3.  Blockchain stores them immutably
4.  Users view notices via frontend

## 8. Security Considerations

-   Immutable blockchain records
-   Admin-only publishing
-   Decentralized storage

## 9. Future Enhancements

-   IPFS integration
-   Role-based access
-   Search & filter
-   Deployment on testnet
-   Mobile version

## 10. Contributors

-   diksha singh
-   nandani rana
-   mehak sharma
-   yukta lohani

## 11. License

MIT License
