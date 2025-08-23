<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import type { DialogClose as DialogCloseProps } from "bits-ui";

	type $$Props = DialogCloseProps;
</script>

<DialogPrimitive.Close {...$$restProps}>
	<slot />
</DialogPrimitive.Close>