<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		tasks,
		completedTasks,
		cancelledTasks,
		userPoints,
		lastDayPointsAdded
	} from './stores.js';
	import TaskList from './components/TaskList.svelte';
	import TaskForm from './components/TaskForm.svelte';
	import PointsDisplay from './components/PointsDisplay.svelte';
	import Tabs from './components/Tabs.svelte';
	import ActivityChart from './components/ActivityChart.svelte';
	import GithubSync from './components/GithubSync.svelte';
	import { incrementTaskValues } from './utils.js';
	import Modal from './components/Modal.svelte';

	let isSyncOpen = false;
	let isTaskFormOpen = false;

	let activeTab = 'active';
	let activityData: any[] = [];
	let intervalId: number;

	// 检查是否需要添加每日点数
	function checkDailyPoints() {
		let today = new Date().toLocaleDateString();
		if ($lastDayPointsAdded !== today) {
			userPoints.set(5);
			lastDayPointsAdded.set(today);

			// 记录活动
			today = new Date().toISOString().split('T')[0];
			updateActivityData(today, 'daily_points', 5);
		}
	}

	// 更新活动数据
	function updateActivityData(date, type, count = 1) {
		const existingIndex = activityData.findIndex((item) => item.date === date);

		if (existingIndex >= 0) {
			const existing = activityData[existingIndex];
			existing[type] = (existing[type] || 0) + count;
			activityData[existingIndex] = existing;
		} else {
			const newData = { date, [type]: count };
			activityData = [...activityData, newData];
		}

		// 保存活动数据到本地存储
		localStorage.setItem('activityData', JSON.stringify(activityData));
	}

	onMount(() => {
		// 从本地存储加载数据
		const storedTasks = localStorage.getItem('tasks');
		const storedCompletedTasks = localStorage.getItem('completedTasks');
		const storedCancelledTasks = localStorage.getItem('cancelledTasks');
		const storedUserPoints = localStorage.getItem('userPoints');
		const storedLastDayPointsAdded = localStorage.getItem('lastDayPointsAdded');
		const storedActivityData = localStorage.getItem('activityData');

		if (storedTasks) $tasks = JSON.parse(storedTasks);
		if (storedCompletedTasks) $completedTasks = JSON.parse(storedCompletedTasks);
		if (storedCancelledTasks) $cancelledTasks = JSON.parse(storedCancelledTasks);
		if (storedUserPoints) $userPoints = parseInt(storedUserPoints);
		if (storedLastDayPointsAdded) $lastDayPointsAdded = storedLastDayPointsAdded;
		if (storedActivityData) activityData = JSON.parse(storedActivityData);

		// 每分钟增加任务分值
		intervalId = setInterval(() => {
			incrementTaskValues($tasks);
			// 保存更新后的任务到本地存储
			localStorage.setItem('tasks', JSON.stringify($tasks));
		}, 60000); // 每分钟执行一次

		// 检查是否需要添加每日点数
		checkDailyPoints();

		// 每天午夜检查是否添加点数
		const midnight = new Date();
		midnight.setHours(24, 0, 0, 0);
		const timeUntilMidnight = midnight - new Date();

		setTimeout(() => {
			checkDailyPoints();
			// 然后每24小时检查一次
			setInterval(checkDailyPoints, 24 * 60 * 60 * 1000);
		}, timeUntilMidnight);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	// 监视存储变化并保存到localStorage
	$: {
		if (typeof localStorage !== 'undefined') {
			console.log("localStorage update");
			
			if ($tasks) localStorage.setItem('tasks', JSON.stringify($tasks));
			if ($completedTasks) localStorage.setItem('completedTasks', JSON.stringify($completedTasks));
			if ($cancelledTasks) localStorage.setItem('cancelledTasks', JSON.stringify($cancelledTasks));
			if ($userPoints) localStorage.setItem('userPoints', $userPoints.toString());
			if ($lastDayPointsAdded) localStorage.setItem('lastDayPointsAdded', $lastDayPointsAdded);
		}
	}

	function handleTaskAction(event) {
		const { action, date, taskId } = event.detail;

		// 记录活动
		const today = date || new Date().toISOString().split('T')[0];
		updateActivityData(today, action);

		isTaskFormOpen = false;
	}
</script>

<main class="mx-auto max-w-4xl p-5 font-sans">
	<div class="flex justify-between">
		<h1 class="mb-5 text-2xl font-bold text-gray-800">Todo</h1>
		<div>
			<button
				on:click={() => {
					isSyncOpen = true;
				}}>同步</button
			>
		</div>
	</div>

	<PointsDisplay points={$userPoints} />

	<Modal
		isOpen={isSyncOpen}
		title="同步到 GitHub Gist"
		onCancel={() => {
			isSyncOpen = false;
		}}
	>
		<GithubSync
			{activityData}
			tasks={$tasks}
			completedTasks={$completedTasks}
			cancelledTasks={$cancelledTasks}
			userPoints={$userPoints}
			lastDayPointsAdded={$lastDayPointsAdded}
		/>
	</Modal>

	<Modal
		isOpen={isTaskFormOpen}
		title="创建新任务"
		onCancel={() => {
			isTaskFormOpen = false;
		}}
	>
		<TaskForm on:taskAction={handleTaskAction} />
	</Modal>

	<Tabs bind:activeTab />

	{#if activeTab === 'active'}
		<TaskList
			tasks={$tasks}
			type="active"
			on:taskAction={handleTaskAction}
			on:addTask={() => {
				isTaskFormOpen = true;
			}}
		/>
	{:else if activeTab === 'completed'}
		<TaskList tasks={$completedTasks} type="completed" on:taskAction={handleTaskAction} />
	{:else if activeTab === 'cancelled'}
		<TaskList tasks={$cancelledTasks} type="cancelled" on:taskAction={handleTaskAction} />
	{:else if activeTab === 'activity'}
		<ActivityChart data={activityData} />
	{/if}
</main>
