<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";

	const tabsListVariants = tv({
		base: "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
	});

	const tabsTriggerVariants = tv({
		base: "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
	});

	const tabsContentVariants = tv({
		base: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	});
</script>

<TabsPrimitive.Root {...$$restProps} let:builder>
	<slot {builder} />
</TabsPrimitive.Root>

<script lang="ts" context="module">
	export const TabsList = TabsPrimitive.List;
	export const TabsTrigger = TabsPrimitive.Trigger;
	export const TabsContent = TabsPrimitive.Content;
</script>