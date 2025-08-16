import 'dotenv/config';
import { runStockTransferAgent } from './lib/agent.js';

async function main() {
  console.log('🤖 Robinhood Stock Transfer Assistant');
  console.log('I can help you transfer stocks from another brokerage to Robinhood!\n');

  // Example usage
  try {
    const result = await runStockTransferAgent(
      "Hi, I want to transfer my stocks from Fidelity to Robinhood. Can you help me?"
    );
    
    console.log('Agent Response:', result.finalOutput);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Interactive mode function
export async function startInteractiveMode() {
  const { createInterface } = await import('readline');
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('🤖 Robinhood Stock Transfer Assistant - Interactive Mode');
  console.log('Type "exit" to quit\n');

  const askQuestion = () => {
    rl.question('You: ', async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const result = await runStockTransferAgent(input);
        console.log('Agent:', result.finalOutput);
        console.log('');
        askQuestion();
      } catch (error) {
        console.error('Error:', error);
        askQuestion();
      }
    });
  };

  askQuestion();
}

// Run main function if this file is executed directly
main();