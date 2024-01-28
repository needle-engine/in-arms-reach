<script lang="ts">
import { Context, ContextRegistry } from "@needle-tools/engine";
  import { onMount } from "svelte";

export let context: Context;
export let wasPlaced: boolean;

ContextRegistry.addContextCreatedCallback((_context) => {
    context = _context.context as Context;
});

onMount(() => {
    if (Context.Current) context = Context.Current;
});

</script>

<needle-engine 
    on:first-placement={() => { wasPlaced = true; }}
    on:reset-placement={() => { wasPlaced = false; }}
></needle-engine>

<style>

</style>