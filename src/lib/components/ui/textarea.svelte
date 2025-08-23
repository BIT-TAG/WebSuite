<script lang="ts">
	import { tv } from "tailwind-variants";

	const textareaVariants = tv({
		base: "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
	});

	type $$Props = {
		class?: string;
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		rows?: number;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let value: $$Props["value"] = "";
	export let placeholder: $$Props["placeholder"] = undefined;
	export let disabled: $$Props["disabled"] = false;
	export let rows: $$Props["rows"] = 3;
</script>

<textarea
	class={textareaVariants({ class: className })}
	{placeholder}
	{disabled}
	{rows}
	bind:value
	{...$$restProps}
	on:blur
	on:change
	on:click
	on:focus
	on:focusin
	on:focusout
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
></textarea>