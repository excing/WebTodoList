<script>
	// PointsDisplay.svelte
	export let points = 0;
</script>

<div
	class="mb-5 flex items-center rounded-lg border-l-4 border-green-500 bg-gray-50 px-4 py-2 shadow-sm"
>
	<div class="mr-3 font-medium text-gray-700">可用支持点数:</div>
	<div class="text-lg font-bold text-green-600">{points}</div>
</div>
