<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import type { TabsList as TabsListProps } from "bits-ui";

	const tabsListVariants = tv({
		base: "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
	});

	type $$Props = TabsListProps & {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List class={tabsListVariants({ class: className })} {...$$restProps}>
	<slot />
</TabsPrimitive.List>