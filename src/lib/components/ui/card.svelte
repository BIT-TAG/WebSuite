<script lang="ts">
	import { tv, type VariantProps } from "tailwind-variants";

	const cardVariants = tv({
		base: "rounded-xl border bg-card text-card-foreground shadow"
	});

	type $$Props = {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={cardVariants({ class: className })} {...$$restProps}>
	<slot />
</div>