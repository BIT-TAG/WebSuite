<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { tv, type VariantProps } from "tailwind-variants";
	import type { Button as ButtonProps } from "bits-ui";

	const buttonVariants = tv({
		base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline"
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	});

	type $$Props = ButtonProps & {
		variant?: VariantProps<typeof buttonVariants>["variant"];
		size?: VariantProps<typeof buttonVariants>["size"];
	};

	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={buttonVariants({ variant, size, class: className })}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>