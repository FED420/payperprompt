# PayPerPrompt - Demo Video Script

**Duration: 5 minutes**

---

## Opening (0:00 - 0:30)

**[Screen: Title card with PayPerPrompt logo]**

**Narrator:**
"Imagine a world where AI agents can pay for services autonomously. No API keys, no subscriptions—just instant micropayments for every request. This is PayPerPrompt."

**[Transition to dashboard]**

---

## Problem Statement (0:30 - 1:00)

**[Screen: Show traditional API key flow with problems highlighted]**

**Narrator:**
"Today's AI monetization is broken. Developers struggle with:
- Complex API key management
- Expensive monthly subscriptions
- No pay-per-use options
- Barriers for autonomous agents

PayPerPrompt solves this using the x402-stacks protocol on the Stacks blockchain."

---

## Solution Overview (1:00 - 2:00)

**[Screen: Architecture diagram animation]**

**Narrator:**
"Here's how it works:

1. A client requests a protected AI endpoint
2. The server responds with HTTP 402 - Payment Required
3. The client automatically sends STX tokens on Stacks blockchain
4. The server verifies the payment and returns the AI response

All of this happens automatically in milliseconds."

**[Screen: Show code snippet of paymentMiddleware]**

"For developers, it's just one line of code:
```javascript
paymentMiddleware({ amount: STXtoMicroSTX(0.1) })
```

That's it. Your API is now monetized."

---

## Live Demo - Server Side (2:00 - 2:45)

**[Screen: VS Code showing server.js]**

**Narrator:**
"Let me show you. Here's our Express server with three AI endpoints:
- Chat completion: 0.1 STX
- Text summarization: 0.05 STX  
- Translation: 0.03 STX

Each endpoint is protected by x402 payment middleware."

**[Screen: Terminal showing server starting]**

"Starting the server... and we're live!"

**[Screen: Browser showing dashboard]**

"This is the PayPerPrompt dashboard. Real-time analytics showing:
- Total requests
- Paid requests
- Revenue in STX

Currently at zero. Let's change that."

---

## Live Demo - Client Side (2:45 - 3:45)

**[Screen: VS Code showing client-demo.js]**

**Narrator:**
"Now the client side. We create an axios client wrapped with automatic payment handling.

When we make a request, the x402-stacks library:
1. Detects the 402 response
2. Signs and broadcasts the STX transaction
3. Retries with payment proof
4. Returns the AI response

Let's run it."

**[Screen: Terminal showing client demo running]**

**Narrator:**
"Watch as it makes three paid requests automatically...

First request: AI chat - Payment sent, response received!
Second request: Summarization - Another successful payment!
Third request: Premium data - Perfect!

**[Screen: Back to dashboard showing updated analytics]**

"And look at our dashboard - it's updated in real-time:
- 3 total requests
- 3 paid requests  
- 0.25 STX in revenue

All tracked automatically."

---

## Use Cases (3:45 - 4:15)

**[Screen: Animated use case cards]**

**Narrator:**
"PayPerPrompt enables powerful use cases:

🤖 **Autonomous AI Agents** - Agents that pay for services they need
📰 **Content Monetization** - Pay-per-article, pay-per-page
🎨 **Creative APIs** - Charge per image, per video, per generation
📊 **Data Services** - Monetize premium data endpoints
🔬 **Research Tools** - Pay-per-query scientific databases

The possibilities are endless."

---

## Technical Highlights (4:15 - 4:45)

**[Screen: Feature highlights]**

**Narrator:**
"What makes PayPerPrompt special:

✅ **Zero Friction** - No signups, no API keys
✅ **Instant Payments** - Micropayments in seconds
✅ **Blockchain Verified** - Trustless, on-chain verification
✅ **Developer Friendly** - Simple SDK, clear docs
✅ **Production Ready** - Error handling, analytics, scalable

Built on Stacks blockchain using the x402 protocol standard."

---

## Closing (4:45 - 5:00)

**[Screen: GitHub repo and links]**

**Narrator:**
"PayPerPrompt reimagines digital monetization for the AI age.

Check out the code on GitHub, read the docs, and start monetizing your AI agents today.

Built for the x402 Stacks Challenge. 

PayPerPrompt - AI monetization made simple."

**[Screen: Logo and tagline]**

**Tagline appears:**
"Reimagining digital monetization, one micropayment at a time."

---

## B-Roll Suggestions

- Code snippets typing out
- Dashboard animations
- Payment flow diagrams
- Blockchain transaction visualizations
- Terminal commands running
- Analytics updating in real-time
- Stacks logo and x402 branding

## Music

- Modern, upbeat tech music
- Builds energy during demo
- Softer during explanation sections

## Graphics

- Clean, modern UI elements
- Purple/pink gradient theme (matching brand)
- Smooth transitions
- Code syntax highlighting
- Animated diagrams

---

## Recording Checklist

- [ ] Record in 1080p or 4K
- [ ] Clear audio (use good microphone)
- [ ] Screen recording at 60fps
- [ ] Show actual working demo (not mocked)
- [ ] Include GitHub link in description
- [ ] Add timestamps in description
- [ ] Include links to:
  - Live demo
  - Documentation
  - x402-stacks docs
  - Stacks blockchain
  - DoraHacks submission

## Upload Details

**Title:** PayPerPrompt - AI Agent Monetization with x402-stacks | DoraHacks Submission

**Description:**
PayPerPrompt enables AI agents to pay for services autonomously using blockchain micropayments. Built for the x402 Stacks Challenge.

🔗 Links:
- GitHub: [your-repo]
- Live Demo: [your-demo]
- Docs: [your-docs]
- x402-stacks: https://docs.x402stacks.xyz/

⏱️ Timestamps:
0:00 - Introduction
0:30 - Problem Statement  
1:00 - Solution Overview
2:00 - Server Demo
2:45 - Client Demo
3:45 - Use Cases
4:15 - Technical Highlights
4:45 - Closing

#blockchain #AI #stacks #x402 #hackathon #web3

**Tags:** blockchain, AI, stacks, micropayments, x402, web3, hackathon, dorahacks
