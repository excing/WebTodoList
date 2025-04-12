<script lang="ts">
	import { onMount } from 'svelte';

	export let isOpen: boolean = false;
	export let title: string = 'Settings';
	export let onCancel: () => void;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			onCancel?.();
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<button
		class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
		on:click={onCancel}
		aria-label="Close"
	></button>

	<!-- Modal -->
	<div
		class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b p-6">
				<h2 class="text-2xl font-semibold text-gray-900">{title}</h2>
				<button
					on:click={onCancel}
					class="p-2 text-gray-500 transition-colors hover:text-gray-700"
					aria-label="Close"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-6">
				<slot>Default modal content</slot>
			</div>
		</div>
	</div>
{/if}
