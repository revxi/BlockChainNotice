# Blockchain Module

This directory contains the smart contracts and deployment scripts for the BlockNotice system.

## Smart Contract: `BlockNotice.sol`

The core contract manages the storage and retrieval of notices.

### Data Structure
```solidity
struct Notice {
    uint256 id;
    address author;
    string title;
    string content;
    uint256 timestamp;
}
```

### Key Functions
- `postNotice(string memory _title, string memory _content)`: Publishes a new notice to the ledger. Emits a `NoticePosted` event.
- `getNotice(uint256 _id)`: Retrieves full details of a specific notice.
- `getNoticeCount()`: Returns the total number of notices.
- `getUserNotices(address _user)`: Returns IDs of notices published by a specific address.

## Setup & Deployment

### Prerequisites
- Node.js
- Hardhat

### Installation
```bash
cd blockchain
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Local Node
Start a local Ethereum node (Hardhat Network):
```bash
npx hardhat node
```

### Deploy to Localhost
In a separate terminal:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*Note: After deployment, update the `CONTRACT_ADDRESS` in `frontend/src/context/Web3Context.jsx` with the new address.*

## Testing
Run the automated test suite:
```bash
npx hardhat test
```
