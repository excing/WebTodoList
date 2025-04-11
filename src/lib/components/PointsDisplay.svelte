<script>
	// PointsDisplay.svelte
	export let points = 0;
</script>

<div class="points-display">
	<div class="points-label">可用支持点数:</div>
	<div class="points-value">{points}</div>
</div>

<style>
	.points-display {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		padding: 10px 15px;
		background-color: #f5f5f5;
		border-radius: 5px;
		border-left: 5px solid #4caf50;
	}

	.points-label {
		margin-right: 10px;
		font-weight: bold;
	}

	.points-value {
		font-size: 18px;
		color: #4caf50;
		font-weight: bold;
	}
</style>
