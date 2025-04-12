<script>
	// MarkdownEditor.svelte - 简单的 Markdown 编辑器组件

	import { onMount } from 'svelte';
	export let value = '';
	let preview = '';
	let showPreview = false;

	// 非常简单的 Markdown 转换函数
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

	$: {
		if (showPreview) {
			preview = convertMarkdown(value);
		}
	}

	function togglePreview() {
		showPreview = !showPreview;
		if (showPreview) {
			preview = convertMarkdown(value);
		}
	}
</script>

<div class="overflow-hidden rounded border border-gray-300">
	<div class="border-b border-gray-300 bg-gray-100 px-3 py-2">
		<button
			type="button"
			class="rounded border border-gray-300 bg-white px-3 py-1 text-sm transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			on:click={togglePreview}
		>
			{showPreview ? '编辑' : '预览'}
		</button>
	</div>

	{#if showPreview}
		<div class="prose prose-sm min-h-40 max-w-none bg-white p-3">
			{@html preview}
		</div>
	{:else}
		<textarea
			bind:value
			placeholder="支持 Markdown 格式"
			class="min-h-40 w-full resize-y border-none p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		></textarea>
	{/if}
</div>
