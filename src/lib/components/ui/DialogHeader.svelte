<script lang="ts">
	import { tv } from "tailwind-variants";

	const headerVariants = tv({
		base: "flex flex-col space-y-1.5 text-center sm:text-left"
	});

	type $$Props = {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={headerVariants({ class: className })} {...$$restProps}>
	<slot />
</div>