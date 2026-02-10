import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { paymentMiddleware, STXtoMicroSTX, getPayment } from 'x402-stacks';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NETWORK = process.env.NETWORK || 'testnet';
const RECIPIENT = process.env.RECIPIENT_ADDRESS;
const PAYMENT_AMOUNT = parseFloat(process.env.PAYMENT_AMOUNT_STX || '0.1');

// Initialize OpenAI (optional - for demo purposes)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Analytics storage (in-memory for demo)
const analytics = {
  totalRequests: 0,
  paidRequests: 0,
  totalRevenue: 0,
  requestsByEndpoint: {}
};

// Helper function to track analytics
function trackRequest(endpoint, amount) {
  analytics.totalRequests++;
  analytics.paidRequests++;
  analytics.totalRevenue += amount;
  analytics.requestsByEndpoint[endpoint] = (analytics.requestsByEndpoint[endpoint] || 0) + 1;
}

// ============================================
// FREE ENDPOINTS (No Payment Required)
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    network: NETWORK,
    paymentEnabled: !!RECIPIENT
  });
});

// Get analytics (free endpoint for demo)
app.get('/api/analytics', (req, res) => {
  res.json({
    ...analytics,
    revenueInSTX: analytics.totalRevenue / 1000000 // Convert microSTX to STX
  });
});

// Get pricing info
app.get('/api/pricing', (req, res) => {
  res.json({
    endpoints: [
      {
        path: '/api/ai/chat',
        description: 'AI Chat Completion',
        priceSTX: PAYMENT_AMOUNT,
        priceMicroSTX: STXtoMicroSTX(PAYMENT_AMOUNT)
      },
      {
        path: '/api/ai/summarize',
        description: 'Text Summarization',
        priceSTX: PAYMENT_AMOUNT * 0.5,
        priceMicroSTX: STXtoMicroSTX(PAYMENT_AMOUNT * 0.5)
      },
      {
        path: '/api/ai/translate',
        description: 'Language Translation',
        priceSTX: PAYMENT_AMOUNT * 0.3,
        priceMicroSTX: STXtoMicroSTX(PAYMENT_AMOUNT * 0.3)
      }
    ],
    network: NETWORK
  });
});

// ============================================
// PAID ENDPOINTS (x402 Payment Required)
// ============================================

// AI Chat Completion - Premium endpoint
app.post('/api/ai/chat',
  paymentMiddleware({
    amount: STXtoMicroSTX(PAYMENT_AMOUNT),
    recipient: RECIPIENT,
    network: NETWORK,
  }),
  async (req, res) => {
    try {
      const payment = getPayment(req);
      const { message, model = 'gpt-3.5-turbo' } = req.body;

      trackRequest('/api/ai/chat', STXtoMicroSTX(PAYMENT_AMOUNT));

      // If OpenAI is configured, use it
      if (openai && message) {
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant powered by PayPerPrompt, a blockchain-based AI monetization platform.' },
            { role: 'user', content: message }
          ],
          max_tokens: 500
        });

        res.json({
          success: true,
          response: completion.choices[0].message.content,
          model: model,
          payment: {
            transactionId: payment?.transactionId,
            amount: PAYMENT_AMOUNT,
            network: NETWORK
          },
          timestamp: new Date().toISOString()
        });
      } else {
        // Demo response if OpenAI is not configured
        res.json({
          success: true,
          response: `Demo AI Response: I received your message "${message || 'Hello'}". This is a demonstration of PayPerPrompt's payment-gated AI API. In production, this would be powered by a real AI model.`,
          model: 'demo-model',
          payment: {
            transactionId: payment?.transactionId,
            amount: PAYMENT_AMOUNT,
            network: NETWORK
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error in /api/ai/chat:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process AI request',
        details: error.message
      });
    }
  }
);

// Text Summarization endpoint
app.post('/api/ai/summarize',
  paymentMiddleware({
    amount: STXtoMicroSTX(PAYMENT_AMOUNT * 0.5),
    recipient: RECIPIENT,
    network: NETWORK,
  }),
  async (req, res) => {
    try {
      const payment = getPayment(req);
      const { text } = req.body;

      trackRequest('/api/ai/summarize', STXtoMicroSTX(PAYMENT_AMOUNT * 0.5));

      if (openai && text) {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a text summarization assistant. Provide concise, accurate summaries.' },
            { role: 'user', content: `Summarize this text: ${text}` }
          ],
          max_tokens: 300
        });

        res.json({
          success: true,
          summary: completion.choices[0].message.content,
          payment: {
            transactionId: payment?.transactionId,
            amount: PAYMENT_AMOUNT * 0.5,
            network: NETWORK
          }
        });
      } else {
        res.json({
          success: true,
          summary: `Demo Summary: This is a summarized version of your text. PayPerPrompt enables micropayments for AI services like this.`,
          payment: {
            transactionId: payment?.transactionId,
            amount: PAYMENT_AMOUNT * 0.5,
            network: NETWORK
          }
        });
      }
    } catch (error) {
      console.error('Error in /api/ai/summarize:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to summarize text',
        details: error.message
      });
    }
  }
);

// Language Translation endpoint
app.post('/api/ai/translate',
  paymentMiddleware({
    amount: STXtoMicroSTX(PAYMENT_AMOUNT * 0.3),
    recipient: RECIPIENT,
    network: NETWORK,
  }),
  async (req, res) => {
    try {
      const payment = getPayment(req);
      const { text, targetLanguage = 'Spanish' } = req.body;

      trackRequest('/api/ai/translate', STXtoMicroSTX(PAYMENT_AMOUNT * 0.3));

      res.json({
        success: true,
        translation: `[${targetLanguage}] Demo translation of: "${text}". PayPerPrompt makes AI monetization seamless!`,
        sourceLanguage: 'English',
        targetLanguage: targetLanguage,
        payment: {
          transactionId: payment?.transactionId,
          amount: PAYMENT_AMOUNT * 0.3,
          network: NETWORK
        }
      });
    } catch (error) {
      console.error('Error in /api/ai/translate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to translate text',
        details: error.message
      });
    }
  }
);

// Premium data endpoint - Example of gating any API
app.get('/api/premium/data',
  paymentMiddleware({
    amount: STXtoMicroSTX(PAYMENT_AMOUNT * 2),
    recipient: RECIPIENT,
    network: NETWORK,
  }),
  (req, res) => {
    const payment = getPayment(req);
    trackRequest('/api/premium/data', STXtoMicroSTX(PAYMENT_AMOUNT * 2));

    res.json({
      success: true,
      data: {
        insights: [
          'Premium insight #1: x402 enables true pay-per-use models',
          'Premium insight #2: No subscriptions, no API keys needed',
          'Premium insight #3: Instant micropayments on Stacks blockchain'
        ],
        timestamp: new Date().toISOString(),
        payment: {
          transactionId: payment?.transactionId,
          amount: PAYMENT_AMOUNT * 2,
          network: NETWORK
        }
      }
    });
  }
);

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================
// START SERVER (Local Development Only)
// ============================================

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              💰 PayPerPrompt API Server 💰                ║
║                                                           ║
║  AI Agent Monetization Platform powered by x402-stacks   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
🌐 Network: ${NETWORK}
💳 Recipient: ${RECIPIENT || 'NOT CONFIGURED'}
💵 Payment Amount: ${PAYMENT_AMOUNT} STX

📋 Available Endpoints:
   
   FREE:
   • GET  /api/health          - Health check
   • GET  /api/analytics       - View earnings analytics
   • GET  /api/pricing         - View pricing info
   
   PAID (x402 Protected):
   • POST /api/ai/chat         - AI Chat (${PAYMENT_AMOUNT} STX)
   • POST /api/ai/summarize    - Text Summary (${PAYMENT_AMOUNT * 0.5} STX)
   • POST /api/ai/translate    - Translation (${PAYMENT_AMOUNT * 0.3} STX)
   • GET  /api/premium/data    - Premium Data (${PAYMENT_AMOUNT * 2} STX)

🎯 Ready to accept payments!
    `);
  });
}

// Export for Vercel serverless
export default app;
