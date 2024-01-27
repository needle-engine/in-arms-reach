<script lang="ts">
import NeedleEngine from "./NeedleEngine.svelte";
import Menu from "./Menu.svelte";
import { CameraSpot } from "./scripts/CameraSpot";
import { Context } from "@needle-tools/engine";

let context: Context;
let cameraSpots: Array<CameraSpot> = [];
let selectedSpot: CameraSpot | null = null;

</script>

<NeedleEngine bind:context={context}></NeedleEngine>
<Menu bind:context={context}></Menu>
