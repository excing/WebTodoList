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

<div class="task-form">
	<h2>创建新任务</h2>

	{#if errorMessage}
		<div class="error">{errorMessage}</div>
	{/if}

	<div class="form-group">
		<label for="title">标题</label>
		<input id="title" bind:value={title} placeholder="任务标题" />
	</div>

	<div class="form-group">
		<label for="description">详细描述 (支持 Markdown)</label>
		<MarkdownEditor bind:value={description} />
	</div>

	<div class="form-group">
		<label for="tags">标签 (用逗号分隔)</label>
		<input id="tags" bind:value={tags} placeholder="例如: 工作, 紧急, 学习" />
	</div>

	<button on:click={addTask}>创建任务 (消耗1点)</button>
</div>

<style>
	.task-form {
		background-color: #f5f5f5;
		padding: 15px;
		border-radius: 5px;
		margin-bottom: 20px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	input,
	textarea {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}

	.error {
		color: #d32f2f;
		margin-bottom: 15px;
	}
</style>
