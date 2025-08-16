<script lang="ts">
	import MessageIcon from '../icons/message.svelte';
	import { scale } from 'svelte/transition';
</script>

<div class="mx-auto max-w-3xl px-4" transition:scale={{ opacity: 0, start: 0.98 }}>
	<div class="flex max-w-xl flex-col gap-4 rounded-xl p-6 text-center leading-relaxed mx-auto">
		<MessageIcon size={24} class="mx-auto" />
		<p>
			I'm an AI-powered assistant that helps you transfer stocks from other brokerages into Robinhood. I can guide you through the process step by step and answer any questions you might have along the way.
		</p>
		<p class="text-sm text-red-600 font-semibold">
			DEMO ONLY. NOT AFFILIATED WITH ROBINHOOD. DO NOT ENTER YOUR PERSONAL INFORMATION
		</p>
	</div>
</div>
