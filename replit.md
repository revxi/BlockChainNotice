# BlockChainNotice

A decentralized blockchain-based notice and file sharing system.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (in `frontend/` directory)
- **Blockchain**: Solidity smart contracts via Hardhat (in `blockchain/` directory)
- **Blockchain Interaction**: Wagmi, Viem, ethers.js

## Project Structure

```
BlockChainNotice/
├── frontend/         # React frontend app (main application)
│   ├── src/
│   │   ├── components/   # React components (Login, AdminPanel, NoticeFeed)
│   │   ├── utils/        # Utilities (ABI, IPFS hash, connectors)
│   │   ├── App.jsx       # Main app logic
│   │   └── main.jsx      # Entry point
│   ├── vite.config.js    # Vite config (port 5000, host 0.0.0.0)
│   └── package.json
├── blockchain/       # Smart contracts (Hardhat)
├── backend/          # Node.js/Express backend (optional)
├── blocknotice/      # Alternate React app scaffold
└── vite.config.js    # Root-level vite config (references frontend/)
```

## Development

The main workflow runs the frontend:
```bash
cd frontend && npm run dev
```

Runs on port 5000.

## Configuration

- Set `VITE_CONTRACT_ADDRESS` in a `.env` file in the `frontend/` directory
- The backend URL defaults to `http://localhost:5000/api`

## Deployment

Configured as a static site deployment:
- Build: `cd frontend && npm run build`
- Public dir: `dist`

## GitHub Push

The GitHub OAuth integration was not set up via Replit. Instead, pushes use a Personal Access Token stored as the `GITHUB_PERSONAL_ACCESS_TOKEN` secret.

To push to GitHub:
```bash
git push https://revxi:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/revxi/BlockChainNotice.git main
```
