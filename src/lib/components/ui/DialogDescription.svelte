<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import type { DialogDescription as DialogDescriptionProps } from "bits-ui";

	const descriptionVariants = tv({
		base: "text-sm text-muted-foreground"
	});

	type $$Props = DialogDescriptionProps & {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Description class={descriptionVariants({ class: className })} {...$$restProps}>
	<slot />
</DialogPrimitive.Description>