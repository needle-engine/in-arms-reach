<script lang="ts">
import NeedleEngine from "./NeedleEngine.svelte";
import Menu from "./Menu.svelte";
import { Context } from "@needle-tools/engine";
import logo from "./lib/titleImage.png";

let context: Context;
let wasPlaced = false;

$: console.log("Was placed changed", wasPlaced);

</script>

<div class="logo">
    <img alt="Logo" src={logo} />
</div>

<div class="vignette"></div>
<div class="menu" class:hidden={wasPlaced}>
    <p>Drag to reveal</p>
    <p class="subtitle">Sound on</p>
</div>
<NeedleEngine bind:context={context} bind:wasPlaced={wasPlaced}></NeedleEngine>

<Menu bind:context={context}></Menu>

<style>

div.logo {
    position:absolute;
    left: 10px;
    top: -30px;
    z-index: 1000;
    -webkit-filter: drop-shadow(5px 6px 26px rgba(0,0,0,0.5));
    filter: drop-shadow(5px 6px 26px rgba(0,0,0,0.5));
}

div.logo img {
    width: min(300px, 50vw);

}

.vignette {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 30vw rgb(255 255 255 / 70%) inset;
  pointer-events: none;
  z-index: 1000;
}

div.menu {
    position: absolute;
    top: 40%;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%, -50%);
    pointer-events: none;
    font-size: 1.4em;
    text-align: center;
    animation: pulse 2s infinite;
    text-transform: uppercase;
    font-weight: bold;
    text-shadow: 10px 20px 50px rgb(69, 107, 139);
    color: grey;
}

div.menu p {
    transition: opacity 0.5s ease-in-out;
    margin:0;
    font-weight: bold;
    color: rgb(69, 107, 139);
}

div.menu p.subtitle {
    font-size: 1em;
    font-weight: normal;
}

div.menu.hidden p {
    opacity: 0;
}

@keyframes pulse {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>