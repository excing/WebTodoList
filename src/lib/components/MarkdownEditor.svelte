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

<div class="markdown-editor">
	<div class="toolbar">
		<button type="button" on:click={togglePreview}>
			{showPreview ? '编辑' : '预览'}
		</button>
	</div>

	{#if showPreview}
		<div class="preview">
			{@html preview}
		</div>
	{:else}
		<textarea bind:value placeholder="支持 Markdown 格式"></textarea>
	{/if}
</div>

<style>
	.markdown-editor {
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
	}

	.toolbar {
		background-color: #f1f1f1;
		padding: 5px;
		border-bottom: 1px solid #ddd;
	}

	textarea {
		width: 100%;
		min-height: 150px;
		padding: 8px;
		border: none;
		resize: vertical;
	}

	.preview {
		min-height: 150px;
		padding: 8px;
		background-color: #fff;
	}

	button {
		background-color: #f1f1f1;
		border: 1px solid #ddd;
		padding: 4px 8px;
		border-radius: 3px;
		cursor: pointer;
	}

	button:hover {
		background-color: #e1e1e1;
	}
</style>
