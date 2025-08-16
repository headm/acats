import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import 'dotenv/config';

const TransferInfoSchema = z.object({
  accountType: z.enum(['taxable', 'ira', 'joint']).describe('The type of account being transferred from'),
  brokerage: z.string().describe('The brokerage the user is transferring from (e.g., Fidelity, Schwab, E*TRADE, etc.)'),
  accountNumber: z.string().describe('The account number from the source brokerage'),
  transferType: z.enum(['full', 'partial']).describe('Whether to transfer the full account or specific assets'),
  specificAssets: z.array(z.object({
    symbol: z.string().describe('Stock/ETF symbol (e.g., AAPL, SPY)'),
    quantity: z.number().describe('Number of shares to transfer')
  })).nullable().describe('Required if transferType is partial - list of specific assets to transfer')
});

type TransferInfo = z.infer<typeof TransferInfoSchema>;

const collectTransferInfo = tool({
  name: 'collectTransferInfo',
  description: 'Collect and validate transfer information from the user',
  parameters: TransferInfoSchema,
  execute: async (info: TransferInfo) => {
    // Validate the collected information
    if (info.transferType === 'partial' && (!info.specificAssets || info.specificAssets.length === 0)) {
      throw new Error('Specific assets must be provided for partial transfers');
    }
    
    return {
      success: true,
      message: 'Transfer information collected successfully',
      data: info
    };
  }
});

const submitTransfer = tool({
  name: 'submitTransfer',
  description: 'Submit the stock transfer request to Robinhood',
  parameters: z.object({
    transferInfo: TransferInfoSchema,
    userConfirmation: z.boolean().describe('User confirmation to proceed with the transfer')
  }),
  execute: async ({ transferInfo, userConfirmation }: { transferInfo: TransferInfo, userConfirmation: boolean }) => {
    if (!userConfirmation) {
      return { success: false, message: 'Transfer cancelled by user' };
    }

    // In a real implementation, this would integrate with Robinhood's API
    // For now, we'll simulate the submission
    const transferId = `RH-${Date.now()}`;
    
    return {
      success: true,
      transferId,
      message: `Transfer submitted successfully! Your transfer ID is ${transferId}. The transfer typically takes 5-7 business days to complete. You can track the status in your Robinhood account under History.`,
      estimatedCompletion: '5-7 business days'
    };
  }
});

export const stockTransferAgent = new Agent({
  name: 'Robinhood Stock Transfer Assistant',
  instructions: `You are a helpful assistant that helps users transfer stocks from other brokerages into their Robinhood account.

Your role is to:
1. Collect all necessary information for the stock transfer
2. Answer questions about the transfer process
3. Submit the transfer once all information is gathered and confirmed

REQUIRED INFORMATION TO COLLECT:
- Account type (taxable, IRA, or joint account)
- Source brokerage name (Fidelity, Schwab, E*TRADE, etc.)
- Account number from the source brokerage
- Transfer type (full account or specific assets)
- If partial transfer: specific assets and quantities

IMPORTANT TRANSFER INFORMATION:
- Transfers typically take 5-7 business days via ACATS
- Robinhood reimburses up to $75 in transfer fees for transfers of $7,500 or more
- Cannot transfer: fractional shares, crypto, mutual funds, bonds, options expiring within 7 days
- CAN transfer: stocks, ETFs, cash, margin balances, options (not expiring soon)
- Cost basis info may take up to 15 days to transfer
- Must have appropriate account approvals (e.g., for options)

Be conversational and helpful. Ask one question at a time to avoid overwhelming the user. Always confirm the collected information before submitting the transfer.`,
  tools: [collectTransferInfo, submitTransfer],
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY
});

export async function runStockTransferAgent(userMessage: string) {
  const result = await run(stockTransferAgent, userMessage);
  return result;
}