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

<div
	class={`mb-4 rounded-lg border shadow-sm ${
		type === 'active'
			? 'border-gray-200 bg-white'
			: type === 'completed'
				? 'border-green-200 bg-green-50'
				: 'border-red-200 bg-red-50'
	}`}
>
	<div class="p-4">
		<div class="mb-3 flex items-start justify-between">
			<div>
				<h3 class="mb-1 text-lg font-medium">{task.title}</h3>

				{#if task.tags && task.tags.length > 0}
					<div class="mb-2 flex flex-wrap gap-1">
						{#each task.tags as tag}
							<span class="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>

			<div class="text-right text-sm text-gray-600">
				{#if type === 'active'}
					<div class="text-xl text-orange-400">值: {task.value}</div>
					<div>支持: {task.supports}</div>
				{:else if type === 'completed'}
					<div>完成于: {formatDate(task.completedDate)}</div>
				{:else if type === 'cancelled'}
					<div>取消于: {formatDate(task.cancelledDate)}</div>
				{/if}
			</div>
		</div>

		<div class="mt-3 flex flex-wrap gap-2">
			<button
				class="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-200"
				on:click={toggleDetails}
			>
				{showDetails ? '隐藏详情' : '显示详情'}
			</button>

			{#if type === 'active'}
				<button
					class="rounded bg-green-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-green-600"
					on:click={() => dispatch('complete')}
				>
					完成
				</button>

				<!-- <button
					class="rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-red-600"
					on:click={() => dispatch('cancel')}
				>
					取消
				</button> -->

				<div class="flex-1"></div>

				<button
					class="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-600"
					on:click={() => dispatch('addSupport')}
				>
					+支持
				</button>

				<button
					class="rounded bg-orange-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-orange-600"
					on:click={() => dispatch('removeSupport')}
				>
					-支持
				</button>
			{:else}
				<button
					class="rounded bg-purple-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-purple-600"
					on:click={() => dispatch('restore')}
				>
					恢复
				</button>
			{/if}
		</div>

		{#if showDetails}
			<div class="mt-4 border-t border-gray-200 pt-4" transition:slide={{ duration: 300 }}>
				<div class="mb-2 text-xs text-gray-500">创建于: {formatDate(task.created)}</div>

				{#if task.description}
					<div class="prose prose-sm max-w-none">
						{@html convertMarkdown(task.description)}
					</div>
				{:else}
					<p class="text-gray-500 italic">无详细描述</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
