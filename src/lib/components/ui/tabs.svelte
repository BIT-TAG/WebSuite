<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { tv } from "tailwind-variants";

	const tabsListVariants = tv({
		base: "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
	});

	const tabsTriggerVariants = tv({
		base: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
	});

	const tabsContentVariants = tv({
		base: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	});
	
	// Entfernt: Ungenutzte export properties
</script>

<TabsPrimitive.Root>
	<slot />
</TabsPrimitive.Root>

<!-- TabsList Component -->
<script lang="ts" context="module">
	import type { ComponentType } from "svelte";
	
	export const Tabs = TabsPrimitive.Root;
	
	export const TabsList: ComponentType<any> = TabsPrimitive.List;
	export const TabsTrigger: ComponentType<any> = TabsPrimitive.Trigger;
	export const TabsContent: ComponentType<any> = TabsPrimitive.Content;
</script>