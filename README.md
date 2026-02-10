# 💰 PayPerPrompt

**AI Agent Monetization Platform powered by x402-stacks**

PayPerPrompt enables developers to monetize their AI agents and APIs using blockchain-based micropayments. Built for the [x402 Stacks Challenge](https://dorahacks.io/hackathon/x402-stacks/buidl), this platform demonstrates how the x402 protocol revolutionizes digital monetization.

![Built on Stacks](https://img.shields.io/badge/Built%20on-Stacks-5546FF)
![x402 Protocol](https://img.shields.io/badge/Protocol-x402-8B5CF6)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

- **🔗 Blockchain Payments**: Seamless micropayments using STX tokens on Stacks blockchain
- **⚡ Instant Monetization**: No subscriptions, no API keys—just pay-per-use
- **🤖 AI-Ready**: Perfect for AI agents, chatbots, and autonomous systems
- **📊 Real-time Analytics**: Track requests, payments, and revenue
- **🎨 Beautiful Dashboard**: Modern, responsive UI for monitoring your API
- **🔒 Secure**: Built on proven x402 protocol with on-chain verification
- **🚀 Easy Integration**: Simple SDK for both sellers and buyers

## 🎯 Use Cases

- **AI Chat APIs**: Charge per conversation or message
- **Content Monetization**: Pay-per-article, pay-per-page models
- **Data Services**: Monetize premium data endpoints
- **Microservices**: Charge for computational resources
- **Translation Services**: Pay-per-translation
- **Image Generation**: Charge per AI-generated image

## 🏗️ Architecture

```
┌─────────────┐         HTTP 402          ┌─────────────┐
│   Client    │ ◄──────────────────────► │   Server    │
│  (Buyer)    │   Payment Required        │  (Seller)   │
└─────────────┘                           └─────────────┘
       │                                         │
       │ 1. Request protected resource           │
       │ ────────────────────────────────────►   │
       │                                         │
       │ 2. 402 Payment Required                 │
       │ ◄────────────────────────────────────   │
       │                                         │
       │ 3. Execute STX payment                  │
       │ ──────────────┐                         │
       │               │ Stacks Blockchain       │
       │ ◄─────────────┘                         │
       │                                         │
       │ 4. Retry with payment proof             │
       │ ────────────────────────────────────►   │
       │                                         │
       │ 5. Verify & return resource             │
       │ ◄────────────────────────────────────   │
       │                                         │
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Stacks wallet with testnet STX ([Get from faucet](https://explorer.hiro.so/sandbox/faucet))
- OpenAI API key (optional, for real AI responses)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/payperprompt.git
cd payperprompt

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

Edit `.env` file:

```env
# Server Configuration
PORT=3000
NETWORK=testnet

# Your Stacks address (receives payments)
RECIPIENT_ADDRESS=SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Payment amount per request (in STX)
PAYMENT_AMOUNT_STX=0.1

# Optional: OpenAI for real AI responses
OPENAI_API_KEY=sk-...

# For client demo: Your private key
CLIENT_PRIVATE_KEY=your_testnet_private_key
```

### Running the Server

```bash
# Start the API server
npm start

# Server will run on http://localhost:3000
```

Open http://localhost:3000 in your browser to see the dashboard!

### Testing with Client Demo

```bash
# Run the client demo (requires CLIENT_PRIVATE_KEY in .env)
npm run client
```

This will make 3 paid API requests and show automatic payment handling.

## 📡 API Endpoints

### Free Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analytics` | GET | View earnings analytics |
| `/api/pricing` | GET | Get pricing information |

### Paid Endpoints (x402 Protected)

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/api/ai/chat` | POST | 0.1 STX | AI chat completion |
| `/api/ai/summarize` | POST | 0.05 STX | Text summarization |
| `/api/ai/translate` | POST | 0.03 STX | Language translation |
| `/api/premium/data` | GET | 0.2 STX | Premium data access |

## 💻 Integration Guide

### For Service Providers (Sellers)

Protect your API endpoints with x402 payments:

```javascript
import { paymentMiddleware, STXtoMicroSTX } from 'x402-stacks';

app.post('/api/your-endpoint',
  paymentMiddleware({
    amount: STXtoMicroSTX(0.1), // 0.1 STX
    recipient: 'YOUR_STACKS_ADDRESS',
    network: 'testnet',
  }),
  (req, res) => {
    // Your protected logic here
    res.json({ data: 'Premium content' });
  }
);
```

### For Consumers (Buyers)

Automatically handle payments when calling protected APIs:

```javascript
import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';

const account = privateKeyToAccount(PRIVATE_KEY, 'testnet');
const client = wrapAxiosWithPayment(axios.create(), {
  account,
  network: 'testnet'
});

// Make requests - payments are handled automatically!
const response = await client.post('http://api.example.com/ai/chat', {
  message: 'Hello AI!'
});
```

## 🎨 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### AI Chat Demo
![AI Chat](./screenshots/chat-demo.png)

### Analytics
![Analytics](./screenshots/analytics.png)

## 🛠️ Tech Stack

- **Backend**: Express.js, Node.js
- **Blockchain**: Stacks, x402-stacks protocol
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **AI**: OpenAI API (optional)
- **Payments**: STX tokens, HTTP 402 standard

## 📊 Project Structure

```
payperprompt/
├── server.js              # Main Express server with x402 middleware
├── client-demo.js         # Client demo showing payment handling
├── public/
│   └── index.html        # Dashboard UI
├── .env.example          # Environment configuration template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎯 Hackathon Submission

This project was built for the **x402 Stacks Challenge** on DoraHacks.

### Key Innovations

1. **AI-First Design**: Optimized for AI agent monetization
2. **Zero Friction**: No API keys, no subscriptions, just pay-per-use
3. **Developer Experience**: Simple SDK, clear documentation
4. **Real-time Analytics**: Track revenue and usage instantly
5. **Production Ready**: Clean code, error handling, scalable architecture

### Demo Video

[Link to 5-minute demo video]

### Live Demo

[Link to hosted demo]

## 🔮 Future Roadmap

- [ ] Multi-token support (sBTC, other SIP-010 tokens)
- [ ] Rate limiting and quotas
- [ ] Webhook notifications for payments
- [ ] SDK for Python, Go, Rust
- [ ] Mobile app for monitoring
- [ ] Advanced analytics and insights
- [ ] Marketplace for AI agents

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [x402-stacks](https://docs.x402stacks.xyz/) for the amazing payment protocol
- [Stacks](https://www.stacks.co/) for the blockchain infrastructure
- [DoraHacks](https://dorahacks.io/) for hosting the hackathon

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

**Built with ❤️ for the x402 Stacks Challenge**

*Reimagining digital monetization, one micropayment at a time.*
