<script lang="ts">
import NeedleEngine from "./NeedleEngine.svelte";
import Menu from "./Menu.svelte";
import { Context } from "@needle-tools/engine";

let context: Context;

</script>

<NeedleEngine bind:context={context}></NeedleEngine>
<Menu bind:context={context}></Menu>
