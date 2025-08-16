import { runStockTransferAgent } from '$lib/agent.js';
import { getMostRecentUserMessage } from '$lib/utils/chat.js';
import { allowAnonymousChats } from '$lib/utils/constants.js';
import { error, json } from '@sveltejs/kit';
import { type UIMessage } from 'ai';

export async function POST({ request }) {
	const { id, messages }: { id: string; messages: UIMessage[] } = await request.json();

	if (!allowAnonymousChats) {
		error(401, 'Unauthorized');
	}

	const userMessage = getMostRecentUserMessage(messages);

	if (!userMessage) {
		error(400, 'No user message found');
	}

	// Extract text content from UI message parts
	const textContent = userMessage.parts
		.filter(part => part.type === 'text')
		.map(part => part.text)
		.join(' ');

	console.log('Processing message:', textContent);

	try {
		const agentResult = await runStockTransferAgent(textContent);
		console.log('Agent result:', agentResult.finalOutput);

		// Return UIMessage format
		return json({
			id: crypto.randomUUID(),
			role: 'assistant',
			parts: [{ type: 'text', text: agentResult.finalOutput }],
			createdAt: new Date()
		});

	} catch (error) {
		console.error('Agent error:', error);
		
		return json({
			id: crypto.randomUUID(),
			role: 'assistant', 
			parts: [{ type: 'text', text: 'I apologize, but I encountered an error processing your request. Please try again.' }],
			createdAt: new Date()
		});
	}
}

export async function DELETE({ request }) {
	// For anonymous chats, we don't need to delete anything from database
	return new Response('Chat deleted', { status: 200 });
}
