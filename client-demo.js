import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:3000';
const NETWORK = process.env.NETWORK || 'testnet';
const PRIVATE_KEY = process.env.CLIENT_PRIVATE_KEY;

if (!PRIVATE_KEY) {
    console.error('❌ Error: CLIENT_PRIVATE_KEY not set in .env file');
    console.log('\n📝 To use this client:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Stacks testnet private key to CLIENT_PRIVATE_KEY');
    console.log('3. Get testnet STX from: https://explorer.hiro.so/sandbox/faucet');
    process.exit(1);
}

// Create account from private key
const account = privateKeyToAccount(PRIVATE_KEY, NETWORK);

// Wrap axios with automatic payment handling
const client = wrapAxiosWithPayment(axios.create(), {
    account,
    network: NETWORK
});

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           💰 PayPerPrompt Client Demo 💰                  ║
║                                                           ║
║  Demonstrating automatic x402 payment handling           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🔑 Account: ${account.address}
🌐 Network: ${NETWORK}
🎯 API: ${API_BASE}

`);

async function testAIChat() {
    console.log('📤 Sending AI chat request...\n');

    try {
        const response = await client.post(`${API_BASE}/api/ai/chat`, {
            message: 'Explain how x402-stacks enables AI agent monetization in 2 sentences.',
            model: 'gpt-3.5-turbo'
        });

        console.log('✅ Success! Response received:\n');
        console.log('AI Response:', response.data.response);
        console.log('\nPayment Details:');
        console.log('  Transaction ID:', response.data.payment.transactionId);
        console.log('  Amount:', response.data.payment.amount, 'STX');
        console.log('  Network:', response.data.payment.network);
        console.log('\n' + '─'.repeat(60) + '\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

async function testSummarize() {
    console.log('📤 Sending summarization request...\n');

    try {
        const response = await client.post(`${API_BASE}/api/ai/summarize`, {
            text: 'The x402 protocol revolutionizes API monetization by enabling direct, programmatic payments for web resources using the HTTP 402 Payment Required status code. Built on blockchain technology, it eliminates the need for traditional API keys, subscriptions, and complex authentication systems. Developers can now charge for API access on a per-request basis, while AI agents can autonomously pay for services they consume. This creates a new paradigm for digital commerce where micropayments flow seamlessly between services.'
        });

        console.log('✅ Success! Summary received:\n');
        console.log('Summary:', response.data.summary);
        console.log('\nPayment Details:');
        console.log('  Transaction ID:', response.data.payment.transactionId);
        console.log('  Amount:', response.data.payment.amount, 'STX');
        console.log('\n' + '─'.repeat(60) + '\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testPremiumData() {
    console.log('📤 Requesting premium data...\n');

    try {
        const response = await client.get(`${API_BASE}/api/premium/data`);

        console.log('✅ Success! Premium data received:\n');
        console.log('Insights:', response.data.data.insights);
        console.log('\nPayment Details:');
        console.log('  Transaction ID:', response.data.data.payment.transactionId);
        console.log('  Amount:', response.data.data.payment.amount, 'STX');
        console.log('\n' + '─'.repeat(60) + '\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function runDemo() {
    console.log('🚀 Starting PayPerPrompt client demo...\n');
    console.log('This demo will make 3 paid API requests:');
    console.log('  1. AI Chat Completion');
    console.log('  2. Text Summarization');
    console.log('  3. Premium Data Access');
    console.log('\nEach request will automatically handle the x402 payment.\n');
    console.log('─'.repeat(60) + '\n');

    // Run tests sequentially
    await testAIChat();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between requests

    await testSummarize();
    await new Promise(resolve => setTimeout(resolve, 2000));

    await testPremiumData();

    console.log('✨ Demo complete!\n');
    console.log('💡 Key Takeaways:');
    console.log('  • x402-stacks handles payments automatically');
    console.log('  • No manual transaction signing needed');
    console.log('  • Works with any HTTP client (axios, fetch, etc.)');
    console.log('  • Perfect for AI agents and autonomous systems');
    console.log('\n🎯 Next Steps:');
    console.log('  • Check the blockchain explorer for your transactions');
    console.log('  • View analytics at http://localhost:3000');
    console.log('  • Integrate into your own AI agents!');
}

// Run the demo
runDemo().catch(console.error);
