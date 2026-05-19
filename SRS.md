# Software Requirements Specification (SRS)
## Project: Decentralized "College Notices"

### 1. Introduction
This document outlines the software requirements for the decentralized "College Notices" project, a blockchain-based official notice board designed for colleges and institutions to publish tamper-proof, transparent, and verifiable notices.

### 2. User Roles & Authentication
* **Public / Student View (Read-Only):** No login required. Students can seamlessly browse the dashboard, view notices, and search for specific updates.
* **Faculty Access (Write-Access):** Faculty members authenticate using a Web3 wallet (like MetaMask) rather than traditional passwords.
* **Super Admin (Project Head/HOD):** The wallet that deploys the smart contract acts as the admin. They have the exclusive ability to grant or revoke posting permissions to other faculty wallets.

### 3. Frontend Interface (UI/UX)
* **Responsive Tailwind Design:** A mobile-friendly interface that looks great on both phones and desktop computers.
* **College Branding:** Custom header featuring the official College of Technology (COT) logo and institutional blue color palette.
* **Landing Page / About Section:** A dedicated introduction page crediting the team (Yukta, etc.), project guide, and the HOD.
* **Notice Dashboard:** The main hub where notices are displayed in clean, readable cards showing the title, date, department tag, and content snippet.
* **Dark/Light Mode Toggle:** A user-accessible switch to change the UI theme for better readability at night.
* **Search Engine:** A search bar to filter notices by keywords, dates, or specific departments.
* **Loading States:** UI skeletons that display while the blockchain data is being fetched, ensuring a smooth user experience.

### 4. Blockchain Backend (Smart Contracts)
* **Immutable Notice Storage:** Notices are permanently stored on the blockchain, ensuring transparency and preventing tampering.
* **Role-Based Access Control (RBAC):** On-chain modifiers (`onlyOwner`, `onlyAuthorized`) that strictly prevent unauthorized wallets from spamming the notice board.
* **Timestamping:** Automatic Unix timestamp generation the moment a block is mined, proving exactly when a notice was issued.
* **Gas-Free Reading:** Optimized `view` functions (`getNotices`) so students never have to pay cryptocurrency gas fees just to read their college updates.

### 5. Middleware & Integration
* **Ethers.js Bridge:** The JavaScript logic that connects the frontend UI to the blockchain network to read and write data in real-time.
* **Legacy System Compatibility:** The architecture is designed so it can be embedded into the existing PHP-based `gbpuat-tech.ac.in` website via an iframe or a lightweight script injection.

### 6. Web2 "Quality of Life" Features
* **Email Subscription Service:** A UI component allowing students to opt-in for email alerts when new notices are published (can be powered later by a simple backend service like Node.js + Nodemailer or a third-party API like Resend).
