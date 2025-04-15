<script>
	// GithubSync.svelte - GitHub API 同步组件

	import { onMount } from 'svelte';
	import QrCodeGenerator from './QRCodeGenerator.svelte';
	import { saveData } from '$lib/utils';

	export let tasks = [];
	export let completedTasks = [];
	export let cancelledTasks = [];
	export let userPoints = 0;
	export let lastDayPointsAdded = '';
	export let activityData = [];

	let token = '';
	let gistId = '';
	let syncStatus = '';
	let syncError = '';
	let lastSynced = '';
	let githubConfig = '';
	let isShowGithubConfigQR = false;
	let isScanning = true;

	$: {
		githubConfig = `{"token": ${token}, "gistID": ${gistId}}`;
	}

	onMount(() => {
		// 从本地存储中加载 GitHub token 和 gist ID
		token = localStorage.getItem('github_token') || '';
		gistId = localStorage.getItem('github_gist_id') || '';
		lastSynced = localStorage.getItem('last_synced') || '';
	});

	function saveCredentials() {
		localStorage.setItem('github_token', token);
		localStorage.setItem('github_gist_id', gistId);
		syncStatus = '凭证已保存';
		setTimeout(() => {
			syncStatus = '';
		}, 3000);
	}

	async function syncToGithub() {
		if (!token) {
			syncError = '请输入 GitHub token';
			return;
		}

		try {
			syncStatus = '正在同步...';
			syncError = '';

			const appData = {
				tasks,
				completedTasks,
				cancelledTasks,
				userPoints,
				lastDayPointsAdded,
				activityData,
				lastUpdated: new Date().toISOString()
			};

			const files = {
				'todo-app-data.json': {
					content: JSON.stringify(appData, null, 2)
				}
			};

			// 如果有gistId则更新，否则创建新的gist
			const url = gistId
				? `https://api.github.com/gists/${gistId}`
				: 'https://api.github.com/gists';

			const method = gistId ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					Authorization: `token ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					description: 'Natural Growth Todo App Data',
					public: false,
					files
				})
			});

			if (!response.ok) {
				throw new Error(`GitHub API 返回错误: ${response.status}`);
			}

			const data = await response.json();

			// 保存新创建的 gist ID
			if (!gistId && data.id) {
				gistId = data.id;
				localStorage.setItem('github_gist_id', gistId);
			}

			// 更新最后同步时间
			lastSynced = new Date().toLocaleString();
			localStorage.setItem('last_synced', lastSynced);

			syncStatus = '同步成功';
			setTimeout(() => {
				syncStatus = '';
			}, 3000);
		} catch (error) {
			console.error('同步错误:', error);
			syncError = `同步失败: ${error.message}`;
		}
	}

	async function syncFromGithub() {
		if (!token || !gistId) {
			syncError = '请输入 GitHub token 和 Gist ID';
			return;
		}

		try {
			syncStatus = '正在从 GitHub 加载数据...';
			syncError = '';

			const response = await fetch(`https://api.github.com/gists/${gistId}`, {
				headers: {
					Authorization: `token ${token}`
				}
			});

			if (!response.ok) {
				throw new Error(`GitHub API 返回错误: ${response.status}`);
			}

			const data = await response.json();

			if (!data.files || !data.files['todo-app-data.json']) {
				throw new Error('找不到应用数据文件');
			}

			const content = data.files['todo-app-data.json'].content;
			const appData = JSON.parse(content);

			// 更新应用数据
			tasks.splice(0, tasks.length, ...appData.tasks);
			completedTasks.splice(0, completedTasks.length, ...appData.completedTasks);
			cancelledTasks.splice(0, cancelledTasks.length, ...appData.cancelledTasks);
			userPoints = appData.userPoints;
			lastDayPointsAdded = appData.lastDayPointsAdded;
			activityData.splice(0, activityData.length, ...appData.activityData);

			// 保存到本地存储
			saveData(tasks, completedTasks, cancelledTasks, userPoints, lastDayPointsAdded, activityData);
			localStorage.setItem('lastDayPointsAdded', lastDayPointsAdded);
			localStorage.setItem('activityData', JSON.stringify(activityData));

			// 更新最后同步时间
			lastSynced = new Date().toLocaleString();
			localStorage.setItem('last_synced', lastSynced);

			syncStatus = '从 GitHub 同步成功';
			setTimeout(() => {
				syncStatus = '';
			}, 3000);
		} catch (error) {
			console.error('同步错误:', error);
			syncError = `同步失败: ${error.message}`;
		}
	}
</script>

<div class="github-sync">
	<div class="form-group">
		<label for="token">GitHub Token (需要 gist 权限)</label>
		<input type="password" id="token" bind:value={token} placeholder="输入 GitHub Token" />
	</div>

	<div class="form-group">
		<label for="gist">Gist ID (可选，留空将创建新的)</label>
		<input type="text" id="gist" bind:value={gistId} placeholder="输入 Gist ID" />
	</div>

	<div class="actions flex flex-wrap">
		<button class="save-btn" on:click={saveCredentials}>保存凭证</button>
		{#if token}
			<button class="upload-btn" on:click={syncToGithub}>上传到 GitHub</button>
			<button class="download-btn" on:click={syncFromGithub}>从 GitHub 下载</button>
			<button
				class="gen-qr-btn"
				on:click={() => {
					isShowGithubConfigQR = !isShowGithubConfigQR;
				}}>配置二维码</button
			>
			<a class="open-gh-btn" href="https://gist.github.com/{gistId}">打开 GitHub Gist</a>
		{/if}
	</div>

	{#if isShowGithubConfigQR}
		<QrCodeGenerator
			data={githubConfig}
			size={180}
			errorCorrection="H"
			qrColor="#2d3748"
			bgColor="#f7fafc"
			customClass="mx-auto m-5"
		/>
	{/if}

	{#if syncStatus}
		<div class="status success">{syncStatus}</div>
	{/if}

	{#if syncError}
		<div class="status error">{syncError}</div>
	{/if}

	{#if lastSynced}
		<div class="last-synced">上次同步: {lastSynced}</div>
	{/if}
</div>

<style>
	.github-sync {
		background-color: #f8f8f8;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 15px;
		margin-bottom: 20px;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 15px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.actions {
		display: flex;
		gap: 10px;
		margin-bottom: 15px;
	}

	button,
	a {
		padding: 8px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		color: white;
	}

	.save-btn {
		background-color: #4caf50;
	}

	.open-gh-btn {
		background-color: #d65900;
	}

	.upload-btn {
		background-color: #2196f3;
	}

	.download-btn {
		background-color: #9c27b0;
	}

	.gen-qr-btn {
		background-color: #333333;
	}

	.status {
		padding: 10px;
		margin-bottom: 15px;
		border-radius: 4px;
	}

	.success {
		background-color: #e8f5e9;
		color: #2e7d32;
	}

	.error {
		background-color: #ffebee;
		color: #c62828;
	}

	.last-synced {
		font-size: 12px;
		color: #666;
		text-align: right;
	}
</style>
