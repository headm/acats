# ACATS Transfer Assistant

An AI-powered agent that helps users transfer stocks from other brokerages into Robinhood using OpenAI's agents framework.

## Features

- Interactive AI agent for stock transfer assistance
- Collects all required transfer information
- Answers questions about the transfer process
- Simulates transfer submission with tracking ID
- Built with SvelteKit and Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your OpenAI API key in `.env`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

### Interactive Agent Mode
Run the transfer assistant in interactive mode:
```bash
npm run agent:interactive
```

### Web Chat Interface
Start the development server to use the interactive web chat:
```bash
npm run dev
```
Then visit http://localhost:5173 to chat with the agent in your browser.

### Single Query Mode
Run a single query against the agent:
```bash
npm run agent
```

## Transfer Information Required

The agent will collect:
- Account type (taxable, IRA, joint)
- Source brokerage name
- Account number from source brokerage
- Transfer type (full account or specific assets)
- Specific assets and quantities (if partial transfer)

## Transfer Process

- Transfers use ACATS system
- Typically take 5-7 business days
- Robinhood reimburses up to $75 in fees for transfers $7,500+
- Supports stocks, ETFs, options (not expiring soon), cash, and margin balances
- Does NOT support fractional shares, crypto, mutual funds, or bonds
