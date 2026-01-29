# 📜 BlockNotice: Blockchain-Based Notice System

**BlockNotice** is a decentralized application (dApp) designed to provide an immutable and transparent way for institutions to issue official notices. By leveraging **Ethereum (Hardhat)** and **IPFS**, notices are anchored to the blockchain, ensuring they cannot be tampered with, deleted, or forged.

---

## ✨ Features
* **Immutable Records:** Notices are stored on-chain, making them permanent and verifiable.
* **Admin Security:** Only authorized wallets (college administration) can publish notices.
* **Decentralized Storage:** Metadata and titles are stored on the blockchain with IPFS hash pointers.
* **Real-time Feed:** Users can view the latest verified notices directly from the blockchain ledger.
* **Responsive UI:** A clean, modern dashboard built with Tailwind CSS.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Ethers.js, Lucide Icons.
* **Blockchain:** Solidity, Hardhat, Ethers.js.
* **Environment:** Node.js / Vite.

---

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies
```bash
# In the blockchain directory
cd blockchain
npm install

# In the frontend directory
cd ../frontend
npm install
