# Charit.able - Blockchain-Powered Charitable Giving

> **Empowering donors and charities through transparent, blockchain-verified giving.**

A revolutionary donation platform built for **NexHacks 2025** that uses blockchain technology to ensure transparency, security, and real-time impact tracking for every charitable donation.

## 🎯 Mission

To transform charitable giving by making it:
- **Transparent**: Every donation immutably recorded on blockchain
- **Trustworthy**: Charities verified and impact tracked in real-time
- **Accessible**: Support for both fiat (USD) and crypto payments
- **Efficient**: Direct fund transfers with conditional smart contract releases
- **Secure**: Enterprise-grade encryption and blockchain verification

## ✨ Key Features

### For Donors
- 🔍 **Blockchain-Verified Receipts** - Immutable donation records
- 📊 **Real-Time Impact Tracking** - See exactly where donations go
- 💳 **Multi-Payment Methods** - USD fiat, crypto, or card payments
- 🎁 **Anonymous Giving** - Optional privacy with full audit trail
- 📱 **Receipt Dashboard** - Organize and track all donations
- ♻️ **Recurring Donations** - Monthly, quarterly, or annual giving

### For Charities
- ✅ **Verified Profile** - Enhanced credibility on platform
- 🌐 **Multi-Currency Support** - Accept USD and crypto donations
- 📈 **Impact Dashboard** - Real-time fundraising and donor analytics
- 🔗 **Smart Contract Releases** - Conditional fund transfers based on milestones
- 📋 **Campaign Management** - Launch and track charitable campaigns
- 📊 **Compliance Reporting** - Automated transaction documentation

### For Corporations
- 👥 **Team Giving Pools** - Collective donations from employees
- 🤝 **Donation Matching** - Double the impact of employee giving
- 📈 **Advanced Analytics** - Custom reports and compliance documentation
- 🎨 **Custom Branding** - White-label CSR initiatives
- 🔌 **API Access** - Integrate giving into your platform
- 👨‍💼 **Dedicated Support** - Account manager included

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **TypeScript/JSX**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **FastAPI** (Python) - High-performance API
- **SQLAlchemy + SQLite** - Database ORM
- **Uvicorn** - ASGI server

### Blockchain & Payments
- **Solana** - Primary blockchain for transactions
- **Streamflow** - Conditional fund releases
- **Coinbase Commerce** - Fiat-to-crypto onramp
- **Stripe** - Payment processing

### AI & Verification
- **Google Gemini** - Receipt verification and OCR
- **OCR Extractor** - Receipt image processing

## 📦 Project Structure

```
Charit.able/
├── frontend/                 # React 19 + Vite application
│   ├── src/
│   │   ├── pages/          # Landing, Home, Pricing, FAQ, Dashboards
│   │   ├── components/     # Reusable UI components
│   │   └── data/           # Charity & campaign data
│   └── vite.config.js
├── server/                  # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes (Coinbase, Stripe, receipts)
│   │   ├── services/       # Business logic (ML, blockchain)
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic request/response models
│   └── requirements.txt
├── ml_service/             # Receipt verification service
│   ├── gemini_verifier.py  # AI-powered receipt validation
│   ├── ocr_extractor.py    # Receipt OCR processing
│   └── requirements.txt
└── streamflow-service/     # Solana conditional payment service
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Frontend)
- Python 3.9+ (Backend & ML)
- SQLite3
- Environment variables set (.env file)

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

#### Backend
```bash
cd server
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### ML Service
```bash
cd ml_service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

## 🔐 Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=sqlite:///./charit_able.db

# Blockchain
WALLET_ADDRESS=your_solana_wallet
STREAMFLOW_API_KEY=your_streamflow_key

# Payments
COINBASE_KEY_NAME=your_coinbase_key
COINBASE_API_KEY=your_coinbase_secret

# AI Services
GEMINI_API_KEY=your_gemini_key

# Development
DEV_MODE=true
```

## 💰 Pricing

- **Individual Donors**: Free
- **Corporate Programs**: $299/month + donation features
- **Charities**: 2.5% per donation received

## 📚 API Documentation

Backend FastAPI documentation available at:
```
http://localhost:8000/docs
```

Key endpoints:
- `POST /api/v1/onramp/session` - Create Coinbase payment session
- `POST /api/v1/receipts/verify` - AI-powered receipt verification
- `GET /api/v1/campaigns` - List active campaigns
- `POST /api/v1/donations` - Record blockchain donation

## 🧪 Testing

### Donate Button Flow
1. Click "Donate Now" button
2. Select donation amount
3. Complete Coinbase payment (test mode in dev)
4. Donation recorded on blockchain
5. Receipt generated and verified via AI

### Receipt Verification
- Upload physical or digital receipt
- Gemini AI extracts transaction details
- Amount and charity matched
- Receipt stored on blockchain

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Requirements

See individual requirements files:
- [Frontend](frontend/package.json)
- [Backend](server/requirements.txt)
- [ML Service](ml_service/requirements.txt)

## 🎓 Team & Credits

Built for NexHacks 2025 - Making charitable giving transparent, secure, and impactful.

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🌍 Roadmap

- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Mobile app (iOS/Android)
- [ ] Impact NFT badges for donors
- [ ] DAO governance for fund allocation
- [ ] Recurring donation scheduling
- [ ] Advanced charity rating system

## 📞 Support

For issues, questions, or feature requests:
- 📧 Email: support@charit-able.com
- 💬 Discord: [Join community]
- 🐛 GitHub Issues: [Report issues]

---

**Made with ❤️ for charitable impact through blockchain technology.**