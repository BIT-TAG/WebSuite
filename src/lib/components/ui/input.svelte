<script lang="ts">
	import { tv } from "tailwind-variants";

	const inputVariants = tv({
		base: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
	});

	type $$Props = {
		class?: string;
		value?: string;
		type?: string;
		placeholder?: string;
		disabled?: boolean;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let value: $$Props["value"] = "";
	export let type: $$Props["type"] = "text";
	export let placeholder: $$Props["placeholder"] = undefined;
	export let disabled: $$Props["disabled"] = false;
</script>

<input
	class={inputVariants({ class: className })}
	{type}
	{placeholder}
	{disabled}
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
/>