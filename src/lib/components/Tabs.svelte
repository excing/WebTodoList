<script>
	// Tabs.svelte
	export let activeTab = 'active';

	const tabs = [
		{ id: 'active', label: 'TODO' },
		{ id: 'completed', label: 'DONE' },
		{ id: 'cancelled', label: 'GONE' },
		{ id: 'activity', label: 'GRAPH' }
	];

	function setActiveTab(tabId) {
		activeTab = tabId;
	}
</script>

<div class="mb-5 flex border-b border-gray-200">
	{#each tabs as tab}
		<button
			class={`border-b-2 flex-1 py-2 font-medium text-gray-700 transition-all duration-200 ${
				activeTab === tab.id
					? 'border-green-500 text-green-600'
					: 'border-transparent hover:bg-gray-50'
			}`}
			on:click={() => setActiveTab(tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>
