<script lang="ts">

export let expanded = true;

</script>

<div class="group" class:minimal={!expanded}>

    {#if $$slots.label}
    <button on:click={() => expanded = !expanded}>
        <slot name="label"></slot>
    </button>
    {/if}
    
    {#if expanded}
    <slot></slot>
    {/if}

</div>

<style>

div.group {
    background-color: rgb(213, 221, 228);
    border-radius: 12px;
    padding: 36px;
    padding-top: 12px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
}

div.group.minimal {
    background: none;
    box-shadow: none;
    padding: 12px;
}

button {
    border: 0;
    outline: 0;
    color: rgb(0, 0, 0);
    background: none;
    margin: 5px;
    font-size: 1em;
}

</style>