# Frontend Module

The user interface for BlockNotice, built with modern web technologies to provide a seamless and accessible experience.

## Tech Stack
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS (Glassmorphism design)
- **Blockchain Interaction**: Ethers.js
- **Icons**: Lucide React

## Project Structure
- `src/components/`: Reusable UI components.
  - `AdminPanel.jsx`: Form for publishing new notices.
  - `NoticeFeed.jsx`: Grid layout for displaying notices.
- `src/NoticeCard.jsx`: Displays individual notices with verified status.
- `src/context/`: Context providers.
  - `Web3Context.jsx`: Manages wallet connection and contract instances.
- `src/App.jsx`: Main application layout and routing logic.

## Setup & Running

### Prerequisites
- Node.js
- MetaMask browser extension installed.

### Installation
```bash
cd frontend
npm install
```

### Development Server
Start the local development server:
```bash
npm run dev
```
Access the app at `http://localhost:5173`.

### Configuration
1. Ensure your local blockchain node is running (`npx hardhat node` in the `blockchain` folder).
2. Connect MetaMask to `Localhost 8545` (Chain ID: 31337).
3. Import a test account from Hardhat into MetaMask using its private key.
4. Verify the `CONTRACT_ADDRESS` in `src/context/Web3Context.jsx` matches your deployed contract.

## Features
- **Notice Board**: Publicly viewable feed of verified notices.
- **Admin Mode**: Toggleable interface for publishing notices (requires transaction signature).
- **Search**: Filter notices by ID, Title, or Date.
- **Dark Mode**: Default dark theme with glass effects.
