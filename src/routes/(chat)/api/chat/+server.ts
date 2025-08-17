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

	// Convert UI messages to simple format for agent
	const conversationMessages = messages.map(msg => ({
		role: msg.role,
		content: msg.parts
			.filter(part => part.type === 'text')
			.map(part => part.text)
			.join(' ')
	}));

	console.log('Processing conversation:', conversationMessages);

	try {
		const agentResult = await runStockTransferAgent(conversationMessages);
		console.log('Agent result:', agentResult.finalOutput);

		// Return UIMessage format
		return json({
			id: Math.random().toString(36).substring(2, 15),
			role: 'assistant',
			parts: [{ type: 'text', text: agentResult.finalOutput }],
			createdAt: new Date()
		});

	} catch (error) {
		console.error('Agent error:', error);
		
		return json({
			id: Math.random().toString(36).substring(2, 15),
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
