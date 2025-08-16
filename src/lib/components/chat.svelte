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
	let isAuthenticated = $state(false);
	let passwordInput = $state('');

	function checkPassword() {
		if (passwordInput === 'acatsagentdemo') {
			isAuthenticated = true;
		} else {
			toast.error('Incorrect password');
			passwordInput = '';
		}
	}

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

{#if !isAuthenticated}
	<div class="bg-background flex h-dvh min-w-0 flex-col items-center justify-center">
		<div class="max-w-md w-full mx-auto p-6">
			<div class="text-center mb-6">
				<div class="flex items-center justify-center gap-2 text-xl font-medium text-foreground mb-2">
					<img src="/robinhood-logo.png" alt="Robinhood" width="24" height="24" />
					Stock Transfer Assistant
				</div>
				<p class="text-muted-foreground">Enter password to access demo</p>
			</div>
			<form onsubmit={(e) => {
				e.preventDefault();
				checkPassword();
			}} class="space-y-4">
				<input
					type="password"
					bind:value={passwordInput}
					placeholder="Password"
					class="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
				/>
				<button
					type="submit"
					class="w-full bg-primary text-primary-foreground hover:bg-primary/80 py-2 px-4 rounded-lg font-medium"
				>
					Access Demo
				</button>
			</form>
		</div>
	</div>
{:else}
	<div class="bg-background flex h-dvh min-w-0 flex-col">
		<ChatHeader {readonly} />
		<Messages
			{readonly}
			loading={isLoading}
			messages={chatMessages}
		/>

		{#if chatMessages.length === 0}
			<div class="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
				<SuggestedActions chatClient={{ append: (msg) => sendMessage(msg.content) }} />
			</div>
		{/if}

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
						class="border-0 bg-transparent p-0 text-sm ring-0 placeholder:text-muted-foreground focus-visible:ring-0 focus:ring-0 focus:outline-none resize-none flex-1"
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
{/if}

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
