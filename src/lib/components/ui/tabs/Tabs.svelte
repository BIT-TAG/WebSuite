<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import type { Tabs as TabsProps } from "bits-ui";

	type $$Props = TabsProps;
</script>

<TabsPrimitive.Root {...$$restProps}>
	<slot />
</TabsPrimitive.Root>