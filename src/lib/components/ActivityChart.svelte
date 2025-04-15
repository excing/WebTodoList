<script>
	// ActivityChart.svelte - 类似Github贡献图的活动图表
	import { onMount } from 'svelte';

	export let data = [];

	let calendarData = [];
	let weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	let today = new Date();

	// 为过去一年准备数据
	onMount(() => {
		prepareCalendarData();
	});

	// 准备日历格式数据
	function prepareCalendarData() {
		const lastYear = new Date();
		lastYear.setFullYear(today.getFullYear() - 1);
		lastYear.setDate(today.getDate() + 1); // Start from one year ago

		const days = [];
		const currentDate = new Date(lastYear);

		// 生成过去一年的每一天
		while (currentDate <= today) {
			const dateString = currentDate.toISOString().split('T')[0];
			const dayData = data.find((d) => d.date === dateString) || { date: dateString };

			// 计算活动总数
			const activityCount =
				(dayData.create || 0) +
				(dayData.complete || 0) +
				(dayData.support || 0) +
				(dayData.unsupport || 0);

			days.push({
				date: dateString,
				dayOfWeek: currentDate.getDay(),
				month: currentDate.getMonth(),
				week: getWeekOfYear(currentDate),
				activityCount,
				details: dayData
			});

			// 增加一天
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// 按周分组
		const weeks = {};
		days.forEach((day) => {
			if (!weeks[day.week]) {
				weeks[day.week] = [];
			}
			weeks[day.week].push(day);
		});

		// 转换为数组格式
		calendarData = Object.values(weeks);
	}

	// 获取一天在一年中的第几周
	function getWeekOfYear(date) {
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	}

	// 获取活动等级的颜色
	function getActivityColor(count) {
		if (count === 0) return '#ebedf0';
		if (count < 3) return '#c6e48b';
		if (count < 6) return '#7bc96f';
		if (count < 9) return '#239a3b';
		return '#196127';
	}

	// 格式化日期显示
	function formatDate(dateString) {
		const date = new Date(dateString);
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
	}

	// 获取活动详情文本
	function getActivityDetails(details) {
		if (!details) return '无活动';

		const items = [];
		if (details.create) items.push(`创建任务: ${details.create}`);
		if (details.complete) items.push(`完成任务: ${details.complete}`);
		if (details.cancel) items.push(`取消任务: ${details.cancel}`);
		if (details.restore) items.push(`恢复任务: ${details.restore}`);
		if (details.support) items.push(`增加支持: ${details.support}`);
		if (details.unsupport) items.push(`减少支持: ${details.unsupport}`);
		if (details.daily_points) items.push(`获得每日点数: ${details.daily_points}`);

		return items.length ? items.join(', ') : '无活动';
	}
</script>

<div class="activity-chart">
	<h2>活动图表</h2>

	<div class="calendar-container">
		<div class="weekday-labels">
			{#each weekdays as weekday, i}
				<div class="weekday-label">{weekday}</div>
			{/each}
		</div>

		<div style="overflow-x: auto;">
			<div class="calendar">
				{#each calendarData as week}
					<div class="week">
						{#each week as day}
							<div
								class="day"
								style="background-color: {getActivityColor(day.activityCount)}"
								title="{formatDate(day.date)}: {getActivityDetails(day.details)}"
							></div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="color-scale">
		<div class="scale-label">少</div>
		<div class="scale-colors">
			<div class="scale-color" style="background-color: #ebedf0"></div>
			<div class="scale-color" style="background-color: #c6e48b"></div>
			<div class="scale-color" style="background-color: #7bc96f"></div>
			<div class="scale-color" style="background-color: #239a3b"></div>
			<div class="scale-color" style="background-color: #196127"></div>
		</div>
		<div class="scale-label">多</div>
	</div>

	<div class="activity-summary">
		<h3>活动统计</h3>
		<div class="stats">
			<div class="stat">
				<div class="stat-label">创建任务</div>
				<div class="stat-value">{data.reduce((sum, day) => sum + (day.create || 0), 0)}</div>
			</div>
			<div class="stat">
				<div class="stat-label">完成任务</div>
				<div class="stat-value">{data.reduce((sum, day) => sum + (day.complete || 0), 0)}</div>
			</div>
			<div class="stat">
				<div class="stat-label">支持任务</div>
				<div class="stat-value">{data.reduce((sum, day) => sum + (day.support || 0), 0)}</div>
			</div>
			<div class="stat">
				<div class="stat-label">活动总数</div>
				<div class="stat-value">
					{data.reduce(
						(sum, day) =>
							sum +
							(day.create || 0) +
							(day.complete || 0) +
							(day.cancel || 0) +
							(day.restore || 0) +
							(day.support || 0) +
							(day.unsupport || 0),
						0
					)}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.activity-chart {
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 20px;
	}

	.calendar-container {
		display: flex;
		margin-top: 20px;
		position: relative;
	}

	.weekday-labels {
		display: flex;
		flex-direction: column;
		margin-right: 10px;
	}

	.weekday-label {
		height: 12px;
		margin-bottom: 4px;
		font-size: 12px;
		color: #767676;
		text-align: right;
		padding-right: 5px;
	}

	.calendar {
		display: flex;
		flex-grow: 1;
		overflow-x: auto;
	}

	.week {
		display: flex;
		flex-direction: column;
		margin-right: 3px;
	}

	.day {
		width: 12px;
		height: 12px;
		margin-bottom: 3px;
		border-radius: 2px;
	}

	.month-labels {
		display: flex;
		justify-content: space-around;
		margin-top: 5px;
	}

	.month-label {
		font-size: 12px;
		color: #767676;
	}

	.color-scale {
		display: flex;
		align-items: center;
		margin-top: 15px;
		justify-content: center;
	}

	.scale-colors {
		display: flex;
		margin: 0 10px;
	}

	.scale-color {
		width: 15px;
		height: 15px;
		margin-right: 2px;
	}

	.scale-label {
		font-size: 12px;
		color: #767676;
	}

	.activity-summary {
		margin-top: 20px;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		margin-top: 10px;
	}

	.stat {
		background-color: #f5f5f5;
		padding: 10px;
		border-radius: 5px;
		flex: 1;
		min-width: 100px;
		text-align: center;
	}

	.stat-label {
		font-size: 14px;
		color: #555;
		margin-bottom: 5px;
	}

	.stat-value {
		font-size: 24px;
		font-weight: bold;
		color: #4caf50;
	}
</style>
