<script>
	// Task.svelte
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let task;
	export let type = 'active'; // active, completed, cancelled

	const dispatch = createEventDispatcher();

	let showDetails = false;

	// 转换Markdown为HTML (简单版本)
	function convertMarkdown(text) {
		if (!text) return '';

		// 转换标题
		text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
		text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
		text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');

		// 转换粗体和斜体
		text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
		text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

		// 转换列表
		text = text.replace(/^\- (.+)$/gm, '<li>$1</li>');
		text = text.replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>');

		// 转换链接
		text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

		// 转换段落
		text = text.replace(/^(?!<[uh]).+$/gm, '<p>$&</p>');

		return text;
	}

	function toggleDetails() {
		showDetails = !showDetails;
	}

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleString();
	}
</script>

<div class="task" class:completed={type === 'completed'} class:cancelled={type === 'cancelled'}>
	<div class="task-header">
		<div class="task-title-container">
			<h3>{task.title}</h3>

			{#if task.tags && task.tags.length > 0}
				<div class="tags">
					{#each task.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>

		<div class="task-meta">
			{#if type === 'active'}
				<span class="task-value">值: {task.value}</span>
				<span class="task-supports">支持: {task.supports}</span>
			{:else if type === 'completed'}
				<span class="task-date">完成于: {formatDate(task.completedDate)}</span>
			{:else if type === 'cancelled'}
				<span class="task-date">取消于: {formatDate(task.cancelledDate)}</span>
			{/if}
		</div>
	</div>

	<div class="task-actions">
		<button class="details-btn" on:click={toggleDetails}>
			{showDetails ? '隐藏详情' : '显示详情'}
		</button>

		{#if type === 'active'}
			<button class="complete-btn" on:click={() => dispatch('complete')}> 完成 </button>
			<button class="cancel-btn" on:click={() => dispatch('cancel')}> 取消 </button>
			<button class="add-support-btn" on:click={() => dispatch('addSupport')}> +支持 </button>
			<button class="remove-support-btn" on:click={() => dispatch('removeSupport')}> -支持 </button>
		{:else}
			<button class="restore-btn" on:click={() => dispatch('restore')}> 恢复 </button>
		{/if}
	</div>

	{#if showDetails}
		<div class="task-details" transition:slide={{ duration: 300 }}>
			<div class="created-date">创建于: {formatDate(task.created)}</div>

			{#if task.description}
				<div class="description">
					{@html convertMarkdown(task.description)}
				</div>
			{:else}
				<p class="no-description">无详细描述</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.task {
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 15px;
		margin-bottom: 15px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.task.completed {
		background-color: #f0fff0;
		border-color: #c8e6c9;
	}

	.task.cancelled {
		background-color: #fff0f0;
		border-color: #ffcdd2;
	}

	.task-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10px;
	}

	.task-title-container {
		display: flex;
		flex-direction: column;
	}

	h3 {
		margin: 0;
		margin-bottom: 5px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-bottom: 5px;
	}

	.tag {
		background-color: #e0e0e0;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 12px;
	}

	.task-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 5px;
	}

	.task-value,
	.task-supports,
	.task-date {
		font-size: 14px;
		color: #666;
	}

	.task-actions {
		display: flex;
		gap: 8px;
		margin-top: 10px;
	}

	button {
		padding: 5px 10px;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		font-size: 14px;
	}

	.details-btn {
		background-color: #f1f1f1;
		color: #333;
	}

	.complete-btn {
		background-color: #4caf50;
		color: white;
	}

	.cancel-btn {
		background-color: #f44336;
		color: white;
	}

	.add-support-btn {
		background-color: #2196f3;
		color: white;
	}

	.remove-support-btn {
		background-color: #ff9800;
		color: white;
	}

	.restore-btn {
		background-color: #9c27b0;
		color: white;
	}

	.task-details {
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid #eee;
	}

	.created-date {
		font-size: 12px;
		color: #999;
		margin-bottom: 10px;
	}

	.description {
		font-size: 14px;
		line-height: 1.5;
	}

	.no-description {
		font-style: italic;
		color: #999;
	}

	button:hover {
		opacity: 0.9;
	}
</style>
