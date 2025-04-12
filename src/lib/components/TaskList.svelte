<script>
	// TaskList.svelte
	import { createEventDispatcher } from 'svelte';
	import { tasks as tasksStore, completedTasks, cancelledTasks, userPoints } from '../stores.js';
	import Task from './Task.svelte';

	export let tasks = [];
	export let type = 'active'; // active, completed, cancelled

	const dispatch = createEventDispatcher();

	function completeTask(taskId) {
		const taskIndex = tasks.findIndex((t) => t.id === taskId);
		if (taskIndex !== -1) {
			const task = tasks[taskIndex];

			// 将任务添加到已完成列表
			completedTasks.update((current) => [
				...current,
				{ ...task, completedDate: new Date().toISOString() }
			]);

			// 从活跃列表中删除
			tasksStore.update((current) => current.filter((t) => t.id !== taskId));

			// 记录活动
			dispatch('taskAction', {
				action: 'complete',
				taskId
			});
		}
	}

	function cancelTask(taskId) {
		const taskIndex = tasks.findIndex((t) => t.id === taskId);
		if (taskIndex !== -1) {
			const task = tasks[taskIndex];

			// 将任务添加到已取消列表
			cancelledTasks.update((current) => [
				...current,
				{ ...task, cancelledDate: new Date().toISOString() }
			]);

			// 从活跃列表中删除
			tasksStore.update((current) => current.filter((t) => t.id !== taskId));

			// 记录活动
			dispatch('taskAction', {
				action: 'cancel',
				taskId
			});
		}
	}

	function addSupport(taskId) {
		if ($userPoints < 1) {
			alert('支持点数不足');
			return;
		}

		tasksStore.update((current) => {
			return current.map((task) => {
				if (task.id === taskId) {
					return { ...task, supports: task.supports + 1 };
				}
				return task;
			});
		});

		userPoints.update((points) => points - 1);

		// 记录活动
		dispatch('taskAction', {
			action: 'support',
			taskId
		});
	}

	function removeSupport(taskId) {
		tasksStore.update((current) => {
			const updatedTasks = current.map((task) => {
				if (task.id === taskId) {
					const newSupports = Math.max(0, task.supports - 1);
					return { ...task, supports: newSupports };
				}
				return task;
			});

			// 检查是否有任务支持点数为0
			const zeroSupportTasks = updatedTasks.filter((t) => t.supports === 0);
			if (zeroSupportTasks.length > 0) {
				// 将支持点数为0的任务移动到已取消列表
				zeroSupportTasks.forEach((task) => {
					cancelledTasks.update((current) => [
						...current,
						{ ...task, cancelledDate: new Date().toISOString() }
					]);

					// 记录取消活动
					dispatch('taskAction', {
						action: 'cancel',
						taskId: task.id
					});
				});

				// 返回没有被取消的任务
				return updatedTasks.filter((t) => t.supports > 0);
			}

			return updatedTasks;
		});

		userPoints.update((points) => points + 1);

		// 记录活动
		dispatch('taskAction', {
			action: 'unsupport',
			taskId
		});
	}

	function restoreTask(taskId) {
		const taskList = type === 'completed' ? $completedTasks : $cancelledTasks;
		const taskIndex = taskList.findIndex((t) => t.id === taskId);

		if (taskIndex !== -1) {
			const task = taskList[taskIndex];

			// 从任务的支持点数是否为0，如果是，则设置为1并消耗一个点数
			if (task.supports === 0) {
				if ($userPoints < 1) {
					alert('支持点数不足，无法恢复任务');
					return;
				}
				task.supports = 1;
				userPoints.update((points) => points - 1);
			}

			// 将任务添加回活跃列表
			tasksStore.update((current) => [
				...current,
				{
					...task,
					completedDate: undefined,
					cancelledDate: undefined
				}
			]);

			// 从对应列表中删除
			if (type === 'completed') {
				completedTasks.update((current) => current.filter((t) => t.id !== taskId));
			} else {
				cancelledTasks.update((current) => current.filter((t) => t.id !== taskId));
			}

			// 记录活动
			dispatch('taskAction', {
				action: 'restore',
				taskId
			});
		}
	}
</script>

<div class="task-list">
	<h2>
		{#if type === 'active'}
			<button
				class="focus:ring-opacity-50 rounded bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
				on:click={() => {
					dispatch('addTask');
				}}>添加新任务</button
			>
		{/if}
	</h2>

	{#if tasks.length === 0}
		<p class="empty-message">
			{#if type === 'active'}
				没有活跃的任务
			{:else if type === 'completed'}
				没有已完成的任务
			{:else if type === 'cancelled'}
				没有已取消的任务
			{/if}
		</p>
	{:else}
		{#each tasks as task (task.id)}
			<Task
				{task}
				{type}
				on:complete={() => completeTask(task.id)}
				on:cancel={() => cancelTask(task.id)}
				on:addSupport={() => addSupport(task.id)}
				on:removeSupport={() => removeSupport(task.id)}
				on:restore={() => restoreTask(task.id)}
			/>
		{/each}
	{/if}
</div>

<style>
	.task-list {
		margin-top: 20px;
	}

	h2 {
		margin-bottom: 15px;
		color: #555;
	}

	.empty-message {
		color: #999;
		font-style: italic;
		text-align: center;
		padding: 20px;
		background-color: #f9f9f9;
		border-radius: 5px;
	}
</style>
