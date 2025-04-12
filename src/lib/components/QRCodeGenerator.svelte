<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import qrcode from 'qrcode-generator';

	export let data: string = '';
	export let size: number = 128;
	export let errorCorrection: 'L' | 'M' | 'Q' | 'H' = 'M';
	export let qrColor: string = '#000000';
	export let bgColor: string = '#ffffff';
	export let customClass: string = '';

	let svgElement: SVGElement;
	let errorMessage: string | null = null;

	const generateQRCode = () => {
		try {
			errorMessage = null;

			if (!data) {
				throw new Error('请输入需要生成二维码的内容');
			}

			const qr = qrcode(0, errorCorrection);
			qr.addData(data);
			qr.make();

			const cells = qr.getModuleCount();
			const cellSize = size / cells;

			// 清空之前的 SVG 内容
			while (svgElement.firstChild) {
				svgElement.removeChild(svgElement.firstChild);
			}

			// 创建 SVG 路径
			const svgNS = 'http://www.w3.org/2000/svg';
			const rects = [];

			for (let row = 0; row < cells; row++) {
				for (let col = 0; col < cells; col++) {
					if (qr.isDark(row, col)) {
						const rect = document.createElementNS(svgNS, 'rect');
						rect.setAttribute('x', (col * cellSize).toString());
						rect.setAttribute('y', (row * cellSize).toString());
						rect.setAttribute('width', cellSize.toString());
						rect.setAttribute('height', cellSize.toString());
						rect.setAttribute('fill', qrColor);
						rects.push(rect);
					}
				}
			}

			// 添加背景
			const background = document.createElementNS(svgNS, 'rect');
			background.setAttribute('width', '100%');
			background.setAttribute('height', '100%');
			background.setAttribute('fill', bgColor);
			svgElement.appendChild(background);

			// 添加二维码路径
			const group = document.createElementNS(svgNS, 'g');
			rects.forEach((rect) => group.appendChild(rect));
			svgElement.appendChild(group);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '生成二维码失败';
		}
	};

	onMount(generateQRCode);
	afterUpdate(generateQRCode);
</script>

<div class="qr-container {customClass}">
	{#if errorMessage}
		<div class="rounded-lg bg-red-50 p-4 text-red-600">
			{errorMessage}
		</div>
	{:else}
		<svg
			bind:this={svgElement}
			width={size}
			height={size}
			viewBox="0 0 {size} {size}"
			class="qr-code rounded-lg border bg-white p-2 shadow-sm"
		/>
	{/if}
</div>

<style lang="postcss">
	.qr-code {
		/* 添加平滑过渡效果 */
		transition: all 0.3s ease;

		/* 点击效果 */
		&:active {
			transform: scale(0.98);
		}
	}
</style>
