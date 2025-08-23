<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import type { DialogTitle as DialogTitleProps } from "bits-ui";

	const titleVariants = tv({
		base: "text-lg font-semibold leading-none tracking-tight"
	});

	type $$Props = DialogTitleProps & {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Title class={titleVariants({ class: className })} {...$$restProps}>
	<slot />
</DialogPrimitive.Title>