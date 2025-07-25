# 🏙️ UrbanScope — Decentralized Urban Governance DApp

UrbanScope is a blockchain-based platform designed to bring transparency, accountability, and participation to urban governance. It enables **residents**, **landowners**, and **local authorities** to propose, vote on, and track key development proposals and infrastructure projects.

## ✨ Features

- 📜 **Proposals:** Create, view, and vote on community proposals (e.g., waste disposal, lighting, water, security).
- 🧑‍🤝‍🧑 **Stakeholder Roles:** Residents and landowners interact with governance workflows via Web3 wallets.
- ⛓️ **Smart Contract Integration:** All voting and proposals are securely stored on-chain.
- 📊 **Status Tracking:** View status of proposals — Active, Approved, Rejected, or Executed.

## 🛠️ Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| Frontend     | [Next.js](https://nextjs.org/) (App Router) + Tailwind CSS |
| Web3 SDK     | [Wagmi](https://wagmi.sh/) + [RainbowKit](https://www.rainbowkit.com/) |
| Blockchain   | Solidity smart contracts (Deployed to Sepolia) |
| Contract Interaction | [Ethers.js](https://docs.ethers.org/v5/) |
| Hosting      | Vercel / GitHub Pages (optional) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nick-Maximillien/urbanscope.git
cd urbanscope
npm install
npm run dev
.
├── public/                # Static assets
├── src/
│   ├── app/               # App Router pages (e.g., /admin, /resident)
│   ├── components/        # Reusable UI components
│   ├── lib/               # ABI, contract functions, wallet config
│   └── styles/            # Tailwind + global styles
├── README.md
├── package.json
└── next.config.js
