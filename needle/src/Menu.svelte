<script lang="ts">

import { Context, GameObject } from "@needle-tools/engine";
import Group from "./Group.svelte";
import rhlogo from "./lib/rh-logo.png";

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

    <Group expanded={false}>
        <span slot="label" class="uppercase">Menu</span>
        
        <a href="mailto:katja.rempel3@gmail.com">Contact Us</a>
        <a href="https://drive.google.com/drive/folders/1bJDomtOQ8x5nLptertP_SvjEP1lyiKKk" target="_blank">Presskit <span>on GDrive</span></a>
        <a href="https://www.youtube.com/watch?v=_xDjOlSIrU0" target="_blank">Video <span>on YouTube</span></a>
        <a href="https://devpost.com/software/test-h62z5t" target="_blank">Info <span>on Devpost</span></a>
        <a href="https://codeberg.org/reality-hack-2024/TABLE_102/" target="_blank">Code <span>on Codeberg</span></a>

        <br/><br/>
        <span class="light"></span>

        <a href="https://www.mitrealityhack.com/" target="_blank"><img src={rhlogo}/></a>

        {#if context}
        <a class="light" on:click={(evt) => {
            context.connection.sendDeleteRemoteStateAll();
            // recreate context
            // context.recreate();
            // reload page
            window.location.reload();
            evt.preventDefault();
        }} href="#">Reset (dev)</a>

        {/if}

        <!--
        <Button on:click={() => setScene(0)}>Water</Button>
        <Button on:click={() => setScene(1)}>Ice</Button>
        <Button on:click={() => setScene(2)}>Fire</Button>
        -->
        <!--
        <Button on:click={() => { GameObject.findObjectOfType(CamRotator)?.recenter() }}>Recenter</Button>
        -->
    </Group>
</div>

<style>

div.container {
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 1.35em;
    z-index: 2000;
}

.uppercase {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.7em;
    color: rgb(69, 107, 139);
}

.uppercase:hover {
    text-decoration: underline;
    cursor: pointer;
}

h2, h4 {
    margin: 5px;
}

a {
    color: black;
    text-decoration: none;
    opacity: 0.8;
    transition: transform 0.1s ease-in-out, opacity 0.1s linear;
    line-height: 2em;
}

a:hover {
    opacity: 1;
    transform: scale(1.05);
    text-decoration: underline;   
}

.light, a span {
    opacity: 0.5;
}

a img {
    max-width: 200px;
}

</style>