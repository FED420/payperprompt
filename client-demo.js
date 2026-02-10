import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { makeSTXTokenTransfer, AnchorMode } = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');
require('dotenv').config();

const API_BASE = 'http://localhost:3000';
const PRIVATE_KEY = process.env.CLIENT_PRIVATE_KEY;
const RECIPIENT = 'ST1TKZ1BA0Q7JGY10MSQX1FHBWZKSX3M7X3EZE9FS'; // Matches .env
const NETWORK_OBJ = new StacksTestnet();

// Headers constants (v2 protocol)
const X402_HEADERS = {
    PAYMENT_REQUIRED: 'payment-required',
    PAYMENT_SIGNATURE: 'payment-signature',
    PAYMENT_RESPONSE: 'payment-response'
};

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           💰 PayPerPrompt Client Demo 💰                  ║
║                                                           ║
║  Demonstrating x402 payment flow (Manual Implementation)  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🔑 Account Key Present: ${!!PRIVATE_KEY}
🌐 Network: Testnet
🎯 API: ${API_BASE}

`);

async function handlePaymentAndRetry(error, originalDetails) {
    if (!error.response || error.response.status !== 402) {
        throw error;
    }

    console.log('  ⚠️  402 Payment Required received. Processing payment...');

    // 1. Get Payment Requirements (prefer body for this demo as per server implementation)
    const paymentReq = error.response.data; // Expecting JSON body from x402-stacks middleware

    if (!paymentReq || !paymentReq.resource) {
        // Fallback to header if body is empty (standard spec)
        const header = error.response.headers[X402_HEADERS.PAYMENT_REQUIRED];
        if (header) {
            // Decode base64 header if needed (not implementing full decode here for brevity unless needed)
            // For this demo, assuming body is populated by middleware
        }
        if (!paymentReq) throw new Error('Could not find payment requirements');
    }

    console.log(`  💳 Requesting payment for: ${paymentReq.resource.name || 'Resource'}`);
    console.log(`  💰 Amount: ${paymentReq.accepts[0].amount} microSTX`);

    // 2. Create Transaction
    const amount = BigInt(paymentReq.accepts[0].amount);
    const payTo = paymentReq.accepts[0].address || RECIPIENT; // Use from req or fallback
    const memo = `x402:${Date.now().toString(36)}`.substring(0, 34);

    const tx = await makeSTXTokenTransfer({
        recipient: payTo,
        amount: amount,
        senderKey: PRIVATE_KEY,
        network: NETWORK_OBJ,
        memo: memo,
        anchorMode: AnchorMode.Any,
    });

    const serializedTx = Buffer.from(tx.serialize()).toString('hex');
    console.log('  ✍️  Transaction signed.');
    // DEBUG: Print hex
    console.log('  🔍 Tx Hex:', serializedTx);

    // 3. Construct Payment Payload
    const paymentPayload = {
        x402Version: 2,
        resource: paymentReq.resource,
        accepted: paymentReq.accepts[0],
        payload: {
            transaction: serializedTx
        }
    };

    // 4. Encode as Base64
    const encodedPayload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

    // 5. Retry Request
    console.log('  🔄 Retrying request with payment signature...');

    const headers = {
        ...originalDetails.headers,
        [X402_HEADERS.PAYMENT_SIGNATURE]: encodedPayload
    };

    if (originalDetails.method === 'post') {
        return axios.post(originalDetails.url, originalDetails.data, { headers });
    } else {
        return axios.get(originalDetails.url, { headers });
    }
}

async function testAIChat() {
    console.log('────────────────────────────────────────────────────────────');
    console.log('📤 Sending AI chat request (POST /api/ai/chat)...');

    const url = `${API_BASE}/api/ai/chat`;
    const data = {
        message: 'Explain x402 in one sentence.',
        model: 'gpt-3.5-turbo'
    };

    try {
        await axios.post(url, data);
    } catch (error) {
        try {
            const response = await handlePaymentAndRetry(error, { method: 'post', url, data });
            console.log('\n✅ Success! Response received:');
            console.log('  🤖 AI:', response.data.response);
            console.log(`  🎫 TxID: ${response.data.payment.transactionId}`);
        } catch (retryError) {
            console.error('❌ Failed after retry:', retryError.message);
            if (retryError.response) console.error(retryError.response.data);
        }
    }
}

async function testSummarize() {
    console.log('────────────────────────────────────────────────────────────');
    console.log('📤 Sending Summarization request (POST /api/ai/summarize)...');

    const url = `${API_BASE}/api/ai/summarize`;
    const data = { text: 'Long text about blockchain...' };

    try {
        await axios.post(url, data);
    } catch (error) {
        try {
            const response = await handlePaymentAndRetry(error, { method: 'post', url, data });
            console.log('\n✅ Success! Summary received:');
            console.log('  📝 Summary:', response.data.summary);
            console.log(`  🎫 TxID: ${response.data.payment.transactionId}`);
        } catch (retryError) {
            console.error('❌ Failed after retry:', retryError.message);
        }
    }
}

async function runDemo() {
    await testAIChat();
    await new Promise(r => setTimeout(r, 1000));
    await testSummarize();

    console.log('\n────────────────────────────────────────────────────────────');
    console.log('✨ Demo Complete!');
}

runDemo().catch(console.error);
