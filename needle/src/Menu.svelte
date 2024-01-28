<script lang="ts">

import { Context, GameObject } from "@needle-tools/engine";
import Button from "./Button.svelte";
import Group from "./Group.svelte";

import { SwitchScene, CamRotator } from "rh24.scripts";

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
            // context.recreate();
            // reload page
            window.location.reload();
        }}>Reset</Button>

        <!--
        <Button on:click={() => setScene(0)}>Water</Button>
        <Button on:click={() => setScene(1)}>Ice</Button>
        <Button on:click={() => setScene(2)}>Fire</Button>
        -->
        <!--
        <Button on:click={() => { GameObject.findObjectOfType(CamRotator)?.recenter() }}>Recenter</Button>
        -->
        {/if}
    </Group>
</div>

<style>

div.container {
    position: absolute;
    top: 0px;
    right: 0px;
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