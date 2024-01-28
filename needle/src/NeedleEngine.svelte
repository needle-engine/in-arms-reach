<script lang="ts">
import { Context, ContextRegistry } from "@needle-tools/engine";

export let context: Context;

ContextRegistry.addContextCreatedCallback((_context) => {
    context = _context.context as Context;
});

</script>

<needle-engine></needle-engine>

<style>

</style>