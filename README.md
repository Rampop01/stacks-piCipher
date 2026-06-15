# PiCipher: Secure The Stacks Mainframe

PiCipher is an immersive, cyberpunk-themed puzzle game built on the Stacks blockchain. Players act as rogue hackers tasked with infiltrating the Stacks Mainframe by decrypting visual anomalies (AI-generated images). 

## 🏆 Hackathon Submission

This project was built to demonstrate seamless integration of Stacks smart contracts with modern web technologies, pushing the boundaries of Web3 gaming UX.

### Key Features
1. **Fully On-Chain Logic:** Registrations, level progressions, bypassing, and purchasing hints are all executed securely on the Stacks blockchain via Clarity smart contracts.
2. **Audio Engine:** An integrated Web Audio API soundscape reacting to keystrokes, success events, and errors to provide a deep cyberpunk feel.
3. **Voice Override:** Experimental Web Speech API integration allowing players to solve puzzles completely hands-free via voice commands.
4. **Micro-transactions:** Frictionless integration of $STX to strategically bypass tough stages or purchase encrypted hints.
5. **Dynamic NFTs:** Players automatically mint a Beginner Badge upon registration and dynamically update their profile as they progress through the mainframe.

### Tech Stack
- **Smart Contracts:** Clarity, Clarinet, Stacks Mocknet/Testnet
- **Frontend:** Next.js 14, TailwindCSS, Lucide Icons, Web Speech API, Web Audio API
- **Web3 Integration:** @stacks/connect-react, @stacks/transactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Leather Wallet or Xverse Wallet extension installed

### Installation & Setup

1. **Clone & Install Dependencies**
```bash
git clone https://github.com/yourusername/picipher-stacks.git
cd picipher-stacks/frontend
npm install
```

2. **Run Local Server**
```bash
npm run dev
```

3. **Play!**
Navigate to `http://localhost:3000` and connect your Stacks wallet to begin your infiltration.

## 📜 Smart Contract

The core engine of PiCipher lies in the `piccipher-game-v2.clar` contract. It handles state transitions, verify players, and issues NFT badges using the SIP-009 standard.

- **Contract Address:** `SP1BTBG1TW13NEV2FQM7HC1BZ9XZV7FZSGPMVV38M.piccipher-game-v2` (Mainnet placeholder)

## 🎨 Design Philosophy
PiCipher abandons the traditional "Web3 Dapp" look in favor of an immersive terminal interface. The goal is to make the player forget they are signing transactions and instead feel like they are executing shell commands against a secure firewall.

---
> *Decrypt the truth. Hack the system. Own your progress.*
