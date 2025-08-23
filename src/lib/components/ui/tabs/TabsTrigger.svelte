<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import type { TabsTrigger as TabsTriggerProps } from "bits-ui";

	const tabsTriggerVariants = tv({
		base: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
	});

	type $$Props = TabsTriggerProps & {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<TabsPrimitive.Trigger class={tabsTriggerVariants({ class: className })} {...$$restProps}>
	<slot />
</TabsPrimitive.Trigger>