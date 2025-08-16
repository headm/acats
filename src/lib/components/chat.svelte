<script lang="ts">
	import { toast } from 'svelte-sonner';
	import ChatHeader from './chat-header.svelte';
	import Messages from './messages.svelte';
	import SuggestedActions from './suggested-actions.svelte';
	import { untrack } from 'svelte';
	import type { UIMessage } from '@ai-sdk/svelte';

	let {
		user,
		chat,
		readonly,
		initialMessages
	}: {
		user: any;
		chat: any;
		initialMessages: UIMessage[];
		readonly: boolean;
	} = $props();

	let chatMessages = $state<UIMessage[]>(untrack(() => [...initialMessages]));
	let isLoading = $state(false);
	let inputValue = $state('');

	async function sendMessage(content: string) {
		if (!content.trim()) return;

		console.log('Sending message:', content);

		// Add user message
		const userMessage: UIMessage = {
			id: crypto.randomUUID(),
			role: 'user',
			parts: [{ type: 'text', text: content }],
			createdAt: new Date()
		};
		chatMessages = [...chatMessages, userMessage];
		console.log('Updated messages with user message:', chatMessages);
		isLoading = true;

		try {
			// Call our API
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: 'simple-chat',
					messages: chatMessages
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			const assistantMessage = await response.json();
			console.log('Received assistant message:', assistantMessage);
			chatMessages = [...chatMessages, assistantMessage];
			console.log('Final messages array:', chatMessages);
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to send message');
		} finally {
			isLoading = false;
		}
	}

</script>

<div class="bg-background flex h-dvh min-w-0 flex-col">
	<ChatHeader {readonly} />
	<Messages
		{readonly}
		loading={isLoading}
		messages={chatMessages}
	/>

	<!-- {#if chatMessages.length === 0}
		<div class="mx-auto max-w-3xl px-4">
			<SuggestedActions chatClient={{ append: (msg) => sendMessage(msg.content) }} />
		</div>
	{/if} -->

	<form class="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6" 
		onsubmit={(e) => {
			e.preventDefault();
			sendMessage(inputValue);
			inputValue = '';
		}}>
		{#if !readonly}
			<div class="bg-muted/25 border-input relative flex min-h-[98px] w-full flex-col overflow-hidden rounded-2xl border px-3 pb-1 pt-3 flex-1">
				<textarea
					bind:value={inputValue}
					placeholder="Ask about transferring stocks to Robinhood..."
					disabled={isLoading}
					class="border-0 bg-transparent p-0 text-sm ring-0 placeholder:text-muted-foreground focus-visible:ring-0 resize-none flex-1"
					onkeydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							sendMessage(inputValue);
							inputValue = '';
						}
					}}
				></textarea>
				<div class="flex w-full items-center justify-end gap-1">
					<button 
						type="submit"
						disabled={!inputValue.trim() || isLoading}
						class="bg-primary text-primary-foreground hover:bg-primary/80 size-8 rounded-full p-0 flex items-center justify-center disabled:opacity-50"
					>
						↑
					</button>
				</div>
			</div>
		{/if}
	</form>
</div>

<!-- TODO -->
<!-- <Artifact
	chatId={id}
	{input}
	{setInput}
	{handleSubmit}
	{isLoading}
	{stop}
	{attachments}
	{setAttachments}
	{append}
	{messages}
	{setMessages}
	{reload}
	{votes}
	{readonly}
/> -->
