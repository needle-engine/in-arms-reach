<script lang="ts">

import { Context, GameObject } from "@needle-tools/engine";
import Button from "./Button.svelte";
import Group from "./Group.svelte";
import { CameraSpot } from "./scripts/CameraSpot";

import { SwitchScene } from "rh24.scripts";

export let cameraSpots: Array<CameraSpot> = [];
export let selectedSpot: CameraSpot | null = null;
export let context: Context;

let foldoutIsOpen = false;

function setScene(index: number) {
    const switcher = GameObject.findObjectOfType(SwitchScene)!;
    switcher.setScene(index);
    console.log("yooo", index)
}

</script>

<div class="container">
    <Group>
        <span slot="label" class="uppercase">Menu</span>
        {#if context}
        <Button on:click={() => {
            context.connection.sendDeleteRemoteStateAll();
            // recreate context
            context.recreate();
        }}>Reset</Button>
        <Button on:click={() => setScene(0)}>Water</Button>
        <Button on:click={() => setScene(1)}>Ice</Button>
        <Button on:click={() => setScene(2)}>Fire</Button>
        {/if}
        {#each cameraSpots as spot}
            <Button on:click={() => selectedSpot = spot}>{spot.name}</Button>
        {/each}
    </Group>

    {#if selectedSpot || foldoutIsOpen}
    <button>Reset</button>
    <Group>
        {#if selectedSpot}
        <h4 class="uppercase">Current selection</h4>
        <h2>{selectedSpot.name}</h2>
        {/if}
    </Group>
    {/if}
</div>

<style>

div.container {
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.uppercase {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.8em;
}

h2, h4 {
    margin: 5px;
}

</style>