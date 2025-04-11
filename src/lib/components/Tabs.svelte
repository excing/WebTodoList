<script>
	// Tabs.svelte
	export let activeTab = 'active';

	const tabs = [
		{ id: 'active', label: '活跃任务' },
		{ id: 'completed', label: '已完成' },
		{ id: 'cancelled', label: '已取消' },
		{ id: 'activity', label: '活动图表' }
	];

	function setActiveTab(tabId) {
		activeTab = tabId;
	}
</script>

<div class="tabs">
	{#each tabs as tab}
		<button class="tab" class:active={activeTab === tab.id} on:click={() => setActiveTab(tab.id)}>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		border-bottom: 1px solid #ddd;
		margin-bottom: 20px;
	}

	.tab {
		padding: 10px 20px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		border-bottom: 3px solid transparent;
		transition: all 0.2s;
	}

	.tab:hover {
		background-color: #f5f5f5;
	}

	.tab.active {
		border-bottom-color: #4caf50;
		font-weight: bold;
	}
</style>
