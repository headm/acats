<script lang="ts">
	import type { Chat } from '@ai-sdk/svelte';
	import { Textarea } from './ui/textarea';
	import { cn } from '$lib/utils/shadcn';
	import { onMount } from 'svelte';
	import { LocalStorage } from '$lib/hooks/local-storage.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { Button } from './ui/button';
	import StopIcon from './icons/stop.svelte';
	import ArrowUpIcon from './icons/arrow-up.svelte';
	import SuggestedActions from './suggested-actions.svelte';

	let {
		chatClient,
		class: c
	}: {
		chatClient: Chat;
		class?: string;
	} = $props();

	let mounted = $state(false);
	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	const storedInput = new LocalStorage('input', '');
	const loading = $derived(chatClient.status === 'streaming' || chatClient.status === 'submitted');

	const adjustHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = `${textareaRef.scrollHeight + 2}px`;
		}
	};

	const resetHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = '98px';
		}
	};

	function setInput(value: string) {
		chatClient.input = value;
		adjustHeight();
	}

	async function submitForm(event?: Event) {
		await chatClient.handleSubmit(event);
		resetHeight();

		if (innerWidth.current && innerWidth.current > 768) {
			textareaRef?.focus();
		}
	}

	onMount(() => {
		chatClient.input = storedInput.value;
		adjustHeight();
		mounted = true;
	});

	$effect.pre(() => {
		storedInput.value = chatClient.input;
	});
</script>

<div class="relative flex w-full flex-col gap-4">
	{#if mounted && chatClient.messages.length === 0}
		<SuggestedActions {chatClient} />
	{/if}

	<div
		class={cn(
			'bg-muted/25 border-input relative flex min-h-[98px] w-full flex-col overflow-hidden rounded-2xl border px-3 pb-1 pt-3',
			c
		)}
	>
		<Textarea
			bind:ref={textareaRef}
			tabindex={0}
			onkeydown={(event) => {
				if (event.key === 'Enter' && !event.shiftKey) {
					event.preventDefault();

					if (loading) {
						chatClient.stop();
					} else {
						submitForm();
					}
				}
			}}
			oninput={(event) => {
				setInput(event.currentTarget.value);
			}}
			spellcheck={false}
			value={chatClient.input}
			class="border-0 bg-transparent p-0 text-sm ring-0 placeholder:text-muted-foreground focus-visible:ring-0"
			placeholder="Ask about transferring stocks to Robinhood..."
			disabled={loading}
		/>

		<div class="flex w-full">
			<div class="flex w-full items-center justify-end gap-1">
				{#if loading}
					<Button
						class="bg-primary text-primary-foreground hover:bg-primary/80 size-8 rounded-full p-0"
						onclick={() => chatClient.stop()}
						disabled={false}
					>
						<StopIcon />
					</Button>
				{:else}
					<Button
						class="bg-primary text-primary-foreground hover:bg-primary/80 size-8 rounded-full p-0"
						onclick={submitForm}
						disabled={chatClient.input.length === 0}
					>
						<ArrowUpIcon />
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>