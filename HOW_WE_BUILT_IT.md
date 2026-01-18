# How We Built Charit.able

## Overview
Charit.able is a blockchain-powered charitable donation platform that leverages Solana's high-speed, low-cost transactions combined with AI-powered verification to create a transparent, trustless giving experience. We built a full-stack application connecting donors, charities, and institutional partners through an intelligent stream-based funding model.

## Tech Stack

### Frontend
- **React 19** with TypeScript for type-safe component development
- **Vite** for fast build and development experience
- **Tailwind CSS & Framer Motion** for modern, responsive UI with smooth animations
- **React Router 7** for client-side navigation
- **Shadcn/ui components** for consistent, accessible UI elements

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - ORM for database schema management
- **SQLite** - Local database for prototyping
- **Uvicorn** - ASGI server for running FastAPI
- **Pydantic** - Data validation and serialization

### Blockchain Integration
- **Solana Web3.js** - JavaScript SDK for Solana interactions
- **Streamflow Protocol** - Conditional token streaming contracts
- **Coinbase Commerce API** - Fiat-to-crypto onramp for donations
- **Ed25519 Cryptography** - JWT-based authentication for Coinbase

### AI/ML Service
- **FastAPI** - Separate microservice for ML operations
- **OpenRouter API** - LLM access (Gemini/GPT models)
- **Tesseract OCR** - Receipt text extraction
- **Pillow** - Image processing for receipt analysis

### Additional Services
- **TypeScript + Express** - Streamflow integration service
- **CORS & Middleware** - Cross-origin request handling

---

## Architecture

### 1. Frontend Layer
```
React SPA (Vite)
├── Pages: Home, Donate, Pricing, FAQ, Charity Pages
├── Components: DonorCard, Navbar, Cards, Dashboard
├── Services: HTTP clients for API communication
└── State: React hooks for local state management
```

**Key Features:**
- **DonorCard Component** - Interactive donation interface with preset amounts
- **Company Dashboard** - Multi-tenant dashboard for corporate giving programs
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Blockchain Status Tracking** - Real-time donation status updates

### 2. Backend API Layer (FastAPI)
```
FastAPI Server (:8000)
├── /api/v1/campaigns - Campaign management
├── /api/v1/vendors - Charity/vendor management
├── /api/v1/receipts - Donation receipt storage
├── /api/v1/dashboard - Analytics & metrics
├── /api/v1/transactions - Transaction history
├── /api/v1/streams - Stream/milestone management
└── /api/v1/onramp - Coinbase payment integration
```

**Core Features:**
- RESTful API with automatic OpenAPI documentation
- Database models for Streams, StreamStages, Proofs, and Transactions
- CORS middleware for frontend communication
- Transaction validation and storage

### 3. Database Schema
```
Streams Table
├── id: Primary key
├── donor_public_key: Solana wallet
├── fundee_public_key: Recipient wallet
├── total_amount_sol: Total stream amount
├── status: active/paused/completed/cancelled
└── created_at: Timestamp

StreamStages Table (4 release stages)
├── stage_index: 0-3
├── percentage: Release % (5%, 15%, 30%, 50%)
├── status: pending/released
└── released_at: Timestamp

Proofs Table (Proof-of-impact)
├── stream_id: FK to Streams
├── stage_index: Which stage this proof is for
├── file_url: Receipt/proof image URL
├── status: pending/verified/rejected
├── ml_confidence: AI verification score
└── ml_explanation: Why it was verified
```

### 4. Blockchain Integration

#### Coinbase Commerce Onramp
- **JWT Authentication** - Ed25519 signed requests to Coinbase API
- **Session Token Generation** - Secure USDC purchase sessions
- **Dynamic Onramp URLs** - Pre-configured with donation amounts
- **Development Mode** - Bypass Coinbase for localhost testing

#### Solana Streamflow
- **Milestone-Based Streaming** - 4-stage conditional token releases
- **Escrow Smart Contract** - Funds locked until proof verification
- **Stage Percentages**: 
  - Stage 1: 5% immediate release
  - Stage 2: 15% (30% cumulative)
  - Stage 3: 30% (60% cumulative)
  - Stage 4: 50% (100% final release)

### 5. ML Service (Microservice)

**Receipt Verification Pipeline:**
1. **Image Upload** - Donor uploads receipt/proof
2. **OCR Extraction** - Tesseract extracts text from image
3. **Gemini Verification** - OpenRouter LLM analyzes if receipt matches donation category
4. **Confidence Scoring** - Returns 0-1 confidence score
5. **Smart Contract Release** - Verified proofs trigger fund releases

**Verification Categories:**
- Donation receipts
- Charity purchases
- Impact proof (photos, documents)
- Payment confirmations

---

## API Endpoints

### Donation Flow
```
POST /api/v1/onramp/session
→ Creates Coinbase payment session
← Returns onramp URL

POST /api/v1/streams/start
→ Creates Solana stream with escrow
← Returns stream ID & transaction hash
```

### Proof Submission
```
POST /api/v1/streams/proof
→ Submits receipt for verification
← ML service verifies receipt
→ On verification: triggers fund release
```

### Dashboard & Analytics
```
GET /api/v1/dashboard/metrics
→ User donations, impact stats

GET /api/v1/transactions
→ Transaction history
```

---

## Key Technical Decisions

### 1. **Microservices Architecture**
- Separated ML service allows independent scaling
- FastAPI backend handles transaction logic
- Streamflow service manages blockchain interactions
- Benefits: Modularity, reusability, easier testing

### 2. **Conditional Token Streaming**
- Instead of instant transfers, we use Streamflow for milestone-based releases
- Ensures accountability: funds only release when proof provided
- Builds trust between donors and charities

### 3. **Multi-Layer Verification**
- **Frontend validation** - Basic input checks
- **Backend validation** - Business logic enforcement
- **ML validation** - AI-powered receipt verification
- **Blockchain validation** - Smart contract checks

### 4. **Development/Production Modes**
- `DEV_MODE=true` - Bypasses Coinbase API for local testing
- `DEV_MODE=false` - Full production with real payment processing
- Enables hackathon development without API keys

### 5. **Type Safety**
- TypeScript frontend for compile-time type checking
- Pydantic models on backend for runtime validation
- SQLAlchemy ORM for database type safety

---

## Integration Flow

```
User donates → Frontend (React) 
  ↓
POST /api/v1/onramp/session (Backend)
  ↓
Coinbase Commerce API (Fiat → USDC)
  ↓
User receives USDC in wallet
  ↓
POST /api/v1/streams/start (Backend)
  ↓
Streamflow Protocol (Create stream with escrow)
  ↓
User receives stream ID → watches milestones
  ↓
Charity uploads impact proof (receipt/photo)
  ↓
POST /api/v1/streams/proof (Backend)
  ↓
ML Service: OCR + Gemini verification
  ↓
Smart contract releases funds if verified ✓
  ↓
Funds flow to charity wallet
```

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Coinbase API rejects localhost | Implemented DEV_MODE flag for testing |
| OCR accuracy on low-quality images | Use Gemini LLM for semantic verification |
| Real-time fund unlocking | Streamflow provides automatic milestone triggers |
| Cross-domain requests | CORS middleware configured for all origins |
| Type safety across stack | TypeScript + Pydantic for end-to-end validation |

---

## Deployment Considerations

- **Frontend**: Deploy to Vercel/Netlify for global CDN
- **Backend**: Deploy FastAPI on cloud (AWS/GCP/Railway)
- **ML Service**: Scale independently with auto-scaling groups
- **Database**: Migrate from SQLite to PostgreSQL for production
- **Blockchain**: Configure for Solana mainnet vs. devnet
- **Coinbase**: Switch from Dev Mode to production API keys

---

## Future Enhancements

1. **Smart Contract Automation** - Full on-chain verification without backend
2. **Mobile App** - React Native for iOS/Android
3. **Multi-chain Support** - Polygon, Arbitrum for lower fees
4. **Impact Dashboard** - Real-time visualization of fund usage
5. **DAO Governance** - Community voting on charity selections
6. **Insurance Layer** - Fraud protection for donors & charities
