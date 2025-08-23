export { default as Button } from "./button.svelte";
export { default as Card } from "./card.svelte";
export { default as Input } from "./input.svelte";
export { default as Textarea } from "./textarea.svelte";
export { default as Badge } from "./badge.svelte";

// Tabs exports
export { default as Tabs } from "./tabs/Tabs.svelte";
export { default as TabsList } from "./tabs/TabsList.svelte";
export { default as TabsTrigger } from "./tabs/TabsTrigger.svelte";
export { default as TabsContent } from "./tabs/TabsContent.svelte";

// Dialog exports
import { 
	Dialog as DialogComponent, 
	DialogTrigger as DialogTriggerComponent, 
	DialogContent as DialogContentComponent, 
	DialogHeader as DialogHeaderComponent, 
	DialogTitle as DialogTitleComponent, 
	DialogDescription as DialogDescriptionComponent, 
	DialogClose as DialogCloseComponent, 
	DialogOverlay as DialogOverlayComponent 
} from "./dialog.svelte";

export const Dialog = DialogComponent;
export const DialogTrigger = DialogTriggerComponent;
export const DialogContent = DialogContentComponent;
export const DialogHeader = DialogHeaderComponent;
export const DialogTitle = DialogTitleComponent;
export const DialogDescription = DialogDescriptionComponent;
export const DialogClose = DialogCloseComponent;
export const DialogOverlay = DialogOverlayComponent;