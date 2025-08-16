<script lang="ts">
	let {
		readonly = false
	}: {
		readonly?: boolean;
	} = $props();
</script>

<header class="bg-background sticky top-0 flex items-center justify-center gap-2 p-4">
	<div class="flex items-center gap-2 text-lg font-medium text-foreground">
		<img src="/robinhood-logo.png" alt="Robinhood" width="24" height="24" />
		Robinhood Stock Transfer Assistant
	</div>
</header>
