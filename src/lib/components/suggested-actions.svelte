<script lang="ts">
	import type { Chat } from '@ai-sdk/svelte';
	import { Button } from './ui/button';
	import { fly } from 'svelte/transition';
	let { chatClient }: { chatClient: Chat } = $props();

	const suggestedActions = [
		{
			title: 'Transfer my stocks',
			label: 'from Fidelity to Robinhood',
			action: 'I want to transfer my stocks from Fidelity to Robinhood. Can you help me?'
		},
		{
			title: 'What fees',
			label: 'are involved in stock transfers?',
			action: 'What fees are involved in transferring stocks to Robinhood?'
		},
		{
			title: 'How long does',
			label: 'a stock transfer take?',
			action: 'How long does a stock transfer typically take?'
		},
		{
			title: 'What types of assets',
			label: 'can I transfer?',
			action: 'What types of assets can I transfer to Robinhood?'
		}
	];
</script>

<div class="grid w-full gap-2 sm:grid-cols-2">
	{#each suggestedActions as suggestedAction, i (suggestedAction.title)}
		<div
			in:fly|global={{ opacity: 0, y: 20, delay: 50 * i, duration: 400 }}
			class={i > 1 ? 'hidden sm:block' : 'block'}
		>
			<Button
				variant="ghost"
				onclick={async () => {
					await chatClient.append({
						role: 'user',
						content: suggestedAction.action
					});
				}}
				class="h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
			>
				<span class="font-medium">{suggestedAction.title}</span>
				<span class="text-muted-foreground">
					{suggestedAction.label}
				</span>
			</Button>
		</div>
	{/each}
</div>
