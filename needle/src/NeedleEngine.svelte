<script lang="ts">
import { Context, ContextRegistry } from "@needle-tools/engine";

export let context: Context;
export let wasPlaced: boolean;

ContextRegistry.addContextCreatedCallback((_context) => {
    context = _context.context as Context;
});

</script>

<needle-engine 
    on:first-placement={() => { wasPlaced = true; console.log("yoooo") }}
    on:reset-placement={() => { wasPlaced = false; }}
></needle-engine>

<style>

</style>