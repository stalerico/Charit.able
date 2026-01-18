# Charit.able
NexHacks 2025!

## Inspiration
We were inspired by the increasing number of fraudulent fundraising campaigns online, especially with AI-generated videos and fake content, making it harder for donors to know what’s real. Traditional donation platforms (like GoFundMe) lack accountability, leaving people hesitant to give and unsure if their contributions are truly making an impact. Thus, we aimed to make a solution that offers transparency in charitable giving, to encourage kindness from everyone 💗

## What it does
Charit.able is a blockchain-powered donation platform that gives users a transparent and trustworthy way to support charities and companies. Users can sign up and traverse through our list of partner companies to donate to. Each company has a confidentiality score, which indicates how trustworthy they are and whether their funds are being used as intended.

To donate, users select a company and specify an amount, which is automatically converted into a stablecoin (USDC) pegged 1:1 to the US dollar, so users don't need prior knowledge of bitcoin or own crypto wallets. Donations are stored in our Phantom wallet and allocated to the intended company. Funds are released in phases, contingent on the company verifying its purchases and providing proof of proper fund usage. Over time, as companies achieve a high confidentiality score, phased verification can be reduced, allowing donations to flow more freely.

By building on Solana’s fast, low-cost blockchain, and using Kairo to write our smart contracts along with the Trae IDE for development, Charit.able gives users a donation experience that’s secure and easy to use. Every contribution is traceable and allocated responsibly, so donors can feel confident that their money is going exactly where it’s meant to 🪙

## How we built it

### Frontend
- **React 19** with TypeScript for type-safe component development
- **Vite** for fast build and development experience
- **Tailwind CSS & Framer Motion** for modern, responsive UI with smooth animations
- **React Router 7** for client-side navigation

### Backend
- **FastAPI** - High-performance Python web framework
- **Kairo** - Smart Contract streams for milestone-based fund releases
- **bs58** - Base58 encoding for Solana addresses
- **SQLAlchemy + SQLite**
- **Solana Python SDK**
- **Pydantic**
- **Express + TypeScript-Node.js API**

### Blockchain Integration
- **Solana Web3.js** - JavaScript SDK for Solana interactions
- **Coinbase Commerce API** - Fiat-to-crypto onramp for donations
- **Kairo** - Smart contract language for defining donation rules and phased fund releases

### IDE's
- **Trae IDE** - Environment for writing, testing, and deploying smart contracts
- **VSCode**
- **Kairo IDE**

## Challenges we ran into
24 hours ago, we didn't have a clue what blockchain was. We had to learn to write secure smart contracts and understand how blockchain works from scratch. We initially used MongoDB Atlas for our backend, but it kept crashing the site under load. Even after switching to a local MongoDB setup, we ran into connection and stability issues, which forced us to sacrifice our backend architecture to prioritize other functionalities. We started building on Solana but ran into compatibility problems with the Phantom wallet, so we switched to using the Solana blockchain directly to maintain functionality.

## Accomplishments that we're proud of
✔️Successfully deployed a working prototype on a testnet 💪; Implemented smart contracts that handle transactions automatically 💵; Created an intuitive frontend (and our best-looking across all our projects) so users can interact with the blockchain without needing prior knowledge ❤️‍🔥

## What we learned
-How to design decentralized applications (dApps) from scratch; The importance of security and testing in smart contract development; How blockchain can solve real-world problems in user trust and transparency

## What's next for Charit.able
Implementing a backend for user accounts; Finalizing the pages on the Webapp; Fixing Bugs
