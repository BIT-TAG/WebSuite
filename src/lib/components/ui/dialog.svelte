<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import { X } from "lucide-svelte";

	const overlayVariants = tv({
		base: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
	});

	const contentVariants = tv({
		base: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
	});

	const headerVariants = tv({
		base: "flex flex-col space-y-1.5 text-center sm:text-left"
	});

	const titleVariants = tv({
		base: "text-lg font-semibold leading-none tracking-tight"
	});

	const descriptionVariants = tv({
		base: "text-sm text-muted-foreground"
	});
</script>

<DialogPrimitive.Root {...$$restProps} let:ids>
	<slot {ids} />
</DialogPrimitive.Root>

<script lang="ts" context="module">
	export const Dialog = DialogPrimitive.Root;
	export const DialogTrigger = DialogPrimitive.Trigger;
	export const DialogContent = DialogPrimitive.Content;
	export const DialogHeader = DialogPrimitive.Header;
	export const DialogTitle = DialogPrimitive.Title;
	export const DialogDescription = DialogPrimitive.Description;
	export const DialogClose = DialogPrimitive.Close;
	export const DialogOverlay = DialogPrimitive.Overlay;
</script>