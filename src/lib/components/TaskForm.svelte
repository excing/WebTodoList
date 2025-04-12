<script>
	// TaskForm.svelte

	import { createEventDispatcher } from 'svelte';
	import { tasks, userPoints } from '../stores.js';
	import MarkdownEditor from './MarkdownEditor.svelte';

	const dispatch = createEventDispatcher();

	let title = '';
	let description = '';
	let tags = '';
	let errorMessage = '';

	function addTask() {
		if (!title.trim()) {
			errorMessage = '任务标题不能为空';
			return;
		}

		if ($userPoints < 1) {
			errorMessage = '支持点数不足，无法创建新任务';
			return;
		}

		const newTask = {
			id: Date.now().toString(),
			title: title.trim(),
			description,
			tags: tags
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag),
			created: new Date().toISOString(),
			value: 0,
			supports: 1 // 创建时默认支持1点
		};

		tasks.update((currentTasks) => [...currentTasks, newTask]);
		userPoints.update((points) => points - 1); // 消耗一个支持点

		// 记录此活动
		dispatch('taskAction', {
			action: 'create',
			taskId: newTask.id
		});

		// 重置表单
		title = '';
		description = '';
		tags = '';
		errorMessage = '';
	}
</script>

<div class="mb-5 rounded-lg bg-gray-100 p-4 shadow-sm">
	<h2 class="mb-3 text-lg font-semibold text-gray-700">创建新任务</h2>

	{#if errorMessage}
		<div class="mb-4 rounded bg-red-50 p-3 text-red-700">{errorMessage}</div>
	{/if}

	<div class="mb-4">
		<label for="title" class="mb-1 block font-medium text-gray-700">标题</label>
		<input
			id="title"
			bind:value={title}
			placeholder="任务标题"
			class="w-full rounded border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
		/>
	</div>

	<div class="mb-4">
		<label for="description" class="mb-1 block font-medium text-gray-700"
			>详细描述 (支持 Markdown)</label
		>
		<MarkdownEditor bind:value={description} />
	</div>

	<div class="mb-4">
		<label for="tags" class="mb-1 block font-medium text-gray-700">标签 (用逗号分隔)</label>
		<input
			id="tags"
			bind:value={tags}
			placeholder="例如: 工作, 紧急, 学习"
			class="w-full rounded border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
		/>
	</div>

	<button
		on:click={addTask}
		class="focus:ring-opacity-50 rounded bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
	>
		创建任务 (消耗1点)
	</button>
</div>
