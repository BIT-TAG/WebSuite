<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import type { Dialog as DialogProps } from "bits-ui";

	type $$Props = DialogProps;
</script>

<DialogPrimitive.Root {...$$restProps}>
	<slot />
</DialogPrimitive.Root>