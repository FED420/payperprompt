# PayPerPrompt SDK - Integration Guide

## Quick Integration Examples

### 1. Express.js Server (Seller)

```javascript
import express from 'express';
import { paymentMiddleware, STXtoMicroSTX } from 'x402-stacks';

const app = express();

// Protect any endpoint with x402 payments
app.post('/api/generate-image',
  paymentMiddleware({
    amount: STXtoMicroSTX(0.5),  // 0.5 STX per image
    recipient: 'YOUR_STACKS_ADDRESS',
    network: 'testnet',
  }),
  async (req, res) => {
    // Your image generation logic
    const image = await generateImage(req.body.prompt);
    res.json({ imageUrl: image });
  }
);

app.listen(3000);
```

### 2. Client Integration (Buyer)

```javascript
import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';

// Setup once
const account = privateKeyToAccount(PRIVATE_KEY, 'testnet');
const client = wrapAxiosWithPayment(axios.create(), {
  account,
  network: 'testnet'
});

// Use anywhere - payments handled automatically!
async function generateImage(prompt) {
  const response = await client.post('https://api.example.com/generate-image', {
    prompt: prompt
  });
  return response.data.imageUrl;
}
```

### 3. AI Agent Integration

```javascript
import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';

class AIAgent {
  constructor(privateKey, network = 'testnet') {
    const account = privateKeyToAccount(privateKey, network);
    this.client = wrapAxiosWithPayment(axios.create(), {
      account,
      network
    });
  }

  async chat(message) {
    const response = await this.client.post('http://localhost:3000/api/ai/chat', {
      message: message
    });
    return response.data.response;
  }

  async summarize(text) {
    const response = await this.client.post('http://localhost:3000/api/ai/summarize', {
      text: text
    });
    return response.data.summary;
  }

  async translate(text, targetLanguage) {
    const response = await this.client.post('http://localhost:3000/api/ai/translate', {
      text: text,
      targetLanguage: targetLanguage
    });
    return response.data.translation;
  }
}

// Usage
const agent = new AIAgent(process.env.PRIVATE_KEY);
const response = await agent.chat('What is blockchain?');
console.log(response);
```

### 4. Python Client (Future)

```python
from x402_stacks import PaymentClient, Account

# Setup
account = Account.from_private_key(PRIVATE_KEY, network='testnet')
client = PaymentClient(account)

# Make paid requests
response = client.post('http://localhost:3000/api/ai/chat', json={
    'message': 'Hello AI!'
})
print(response.json()['response'])
```

### 5. Autonomous Agent Example

```javascript
import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';

class AutonomousResearchAgent {
  constructor(privateKey, budget) {
    const account = privateKeyToAccount(privateKey, 'testnet');
    this.client = wrapAxiosWithPayment(axios.create(), {
      account,
      network: 'testnet'
    });
    this.budget = budget; // STX
    this.spent = 0;
  }

  async research(topic) {
    if (this.spent >= this.budget) {
      throw new Error('Budget exceeded');
    }

    // Step 1: Get initial data (0.2 STX)
    const data = await this.client.get('http://localhost:3000/api/premium/data');
    this.spent += 0.2;

    // Step 2: Summarize findings (0.05 STX)
    const summary = await this.client.post('http://localhost:3000/api/ai/summarize', {
      text: JSON.stringify(data.data)
    });
    this.spent += 0.05;

    // Step 3: Generate report (0.1 STX)
    const report = await this.client.post('http://localhost:3000/api/ai/chat', {
      message: `Create a research report on ${topic} based on: ${summary.data.summary}`
    });
    this.spent += 0.1;

    return {
      topic,
      data: data.data,
      summary: summary.data.summary,
      report: report.data.response,
      totalCost: this.spent
    };
  }
}

// Usage
const agent = new AutonomousResearchAgent(PRIVATE_KEY, 1.0); // 1 STX budget
const result = await agent.research('AI monetization');
console.log(`Research complete! Cost: ${result.totalCost} STX`);
```

## Advanced Patterns

### Dynamic Pricing

```javascript
app.post('/api/ai/chat',
  (req, res, next) => {
    // Calculate price based on model
    const model = req.body.model || 'gpt-3.5-turbo';
    const prices = {
      'gpt-3.5-turbo': 0.1,
      'gpt-4': 0.5,
      'gpt-4-turbo': 0.3
    };
    
    // Attach dynamic middleware
    paymentMiddleware({
      amount: STXtoMicroSTX(prices[model]),
      recipient: RECIPIENT,
      network: NETWORK,
    })(req, res, next);
  },
  async (req, res) => {
    // Handle request
  }
);
```

### Usage Tracking

```javascript
import { getPayment } from 'x402-stacks';

app.post('/api/ai/chat',
  paymentMiddleware({...}),
  async (req, res) => {
    const payment = getPayment(req);
    
    // Track in database
    await db.payments.insert({
      transactionId: payment.transactionId,
      amount: payment.amount,
      endpoint: '/api/ai/chat',
      timestamp: new Date()
    });
    
    // Your logic
    res.json({...});
  }
);
```

### Rate Limiting by Payment

```javascript
const userRequests = new Map();

app.post('/api/ai/chat',
  paymentMiddleware({...}),
  (req, res, next) => {
    const payment = getPayment(req);
    const userId = payment.sender;
    
    // Track requests per user
    const count = userRequests.get(userId) || 0;
    if (count > 100) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    userRequests.set(userId, count + 1);
    next();
  },
  async (req, res) => {
    // Handle request
  }
);
```

## Testing

### Local Testing Without Payments

```javascript
// Disable payments for local testing
const isDev = process.env.NODE_ENV === 'development';

app.post('/api/ai/chat',
  isDev ? (req, res, next) => next() : paymentMiddleware({...}),
  async (req, res) => {
    // Your logic
  }
);
```

### Mock Client for Testing

```javascript
class MockPaymentClient {
  constructor() {
    this.client = axios.create();
  }

  async post(url, data) {
    console.log(`[MOCK] Would pay for: ${url}`);
    return this.client.post(url, data);
  }
}

// Use in tests
const client = process.env.NODE_ENV === 'test' 
  ? new MockPaymentClient()
  : createRealClient();
```

## Best Practices

1. **Always validate inputs** before processing paid requests
2. **Log all payments** for accounting and debugging
3. **Handle errors gracefully** - refund if service fails
4. **Use testnet first** before deploying to mainnet
5. **Set reasonable prices** - test with users
6. **Monitor analytics** - track conversion rates
7. **Provide free tier** - let users try before paying
8. **Clear pricing** - always show costs upfront

## Troubleshooting

### Common Issues

**Payment not detected:**
- Check network (testnet vs mainnet)
- Verify recipient address is correct
- Ensure client has sufficient STX balance

**Transaction fails:**
- Check STX balance
- Verify network connectivity
- Check Stacks blockchain status

**Server doesn't verify payment:**
- Ensure facilitator is accessible
- Check transaction confirmation time
- Verify payment amount matches

## Resources

- [x402-stacks Documentation](https://docs.x402stacks.xyz/)
- [Stacks Blockchain](https://www.stacks.co/)
- [Get Testnet STX](https://explorer.hiro.so/sandbox/faucet)
- [PayPerPrompt GitHub](https://github.com/yourusername/payperprompt)
