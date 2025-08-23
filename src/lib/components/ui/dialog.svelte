<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";

	const overlayVariants = tv({
		base: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
	});

	const contentVariants = tv({
		base: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
	});

	// Entfernt: Ungenutzte export properties
</script>

<DialogPrimitive.Root>
	<slot />
</DialogPrimitive.Root>

<script lang="ts" context="module">
	import type { ComponentType } from "svelte";
	
	export const Dialog = DialogPrimitive.Root;
	export const DialogTrigger: ComponentType<any> = DialogPrimitive.Trigger;
	export const DialogContent: ComponentType<any> = DialogPrimitive.Content;
	export const DialogHeader: ComponentType<any> = DialogPrimitive.Header;
	export const DialogTitle: ComponentType<any> = DialogPrimitive.Title;
	export const DialogDescription: ComponentType<any> = DialogPrimitive.Description;
	export const DialogClose: ComponentType<any> = DialogPrimitive.Close;
	export const DialogOverlay: ComponentType<any> = DialogPrimitive.Overlay;
</script>