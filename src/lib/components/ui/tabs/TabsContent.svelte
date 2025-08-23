<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";
	import type { TabsContent as TabsContentProps } from "bits-ui";

	const tabsContentVariants = tv({
		base: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	});

	type $$Props = TabsContentProps & {
		class?: string;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<TabsPrimitive.Content class={tabsContentVariants({ class: className })} {...$$restProps}>
	<slot />
</TabsPrimitive.Content>