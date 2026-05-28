<script lang="ts">
import { Context, ContextRegistry } from "@needle-tools/engine";
import { onMount } from "svelte";

let {
    context = $bindable(),
    wasPlaced = $bindable()
}: {
    context: Context | undefined;
    wasPlaced: boolean;
} = $props();

let needleEngineElement = $state<HTMLElement>();

ContextRegistry.addContextCreatedCallback((_context) => {
    context = _context.context as Context;
});

onMount(() => {
    if (Context.Current) context = Context.Current;
    
    // Manually add event listeners for custom events from the web component
    if (needleEngineElement) {
        const handleFirstPlacement = () => {
            wasPlaced = true;
        };
        
        const handleResetPlacement = () => {
            wasPlaced = false;
        };
        
        needleEngineElement.addEventListener("first-placement", handleFirstPlacement);
        needleEngineElement.addEventListener("reset-placement", handleResetPlacement);
        
        return () => {
            if (needleEngineElement) {
                needleEngineElement.removeEventListener("first-placement", handleFirstPlacement);
                needleEngineElement.removeEventListener("reset-placement", handleResetPlacement);
            }
        };
    } else {
        return () => {};
    }
});

</script>

<needle-engine bind:this={needleEngineElement}></needle-engine>

<style>

</style>