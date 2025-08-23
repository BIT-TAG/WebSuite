<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import type { DialogTrigger as DialogTriggerProps } from "bits-ui";

	type $$Props = DialogTriggerProps;
</script>

<DialogPrimitive.Trigger {...$$restProps}>
	<slot />
</DialogPrimitive.Trigger>