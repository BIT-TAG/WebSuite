<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import type { DialogOverlay as DialogOverlayProps } from "bits-ui";

	const overlayVariants = tv({
		base: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
	});

	type $$Props = DialogOverlayProps & {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Overlay class={overlayVariants({ class: className })} {...$$restProps}>
	<slot />
</DialogPrimitive.Overlay>