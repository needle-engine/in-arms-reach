<script lang="ts">
    import nl from "./lib/needle-logo.png";
</script>

<div>
    <a href="https://needle.tools" target="_blank">
        <span>Made with</span> <img src={nl} alt="Needle Engine Logo"/> Needle Engine
    </a>
</div>

<style>

a {
    text-decoration: none;
    cursor: pointer;
    color: black;
}

div {
    position: absolute;
    bottom: 29px;
    left: 50%;
    transform: translateX(-50%);
    color: black;
    font-weight: normal;

    animation: fadein 1s ease-in-out;
    animation-delay: 2s;
    animation-fill-mode: backwards;

    width: 100vw;
    text-align: center;
}

img {
    width: 2.5em;
    vertical-align: middle;
    transform: translateY(-3px);
}

span {
    opacity: 0.7;
    font-weight: 100;
}

:global(body) {

    font-family: Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif;
    font-weight: 100;
}

@keyframes fadein {
    0% { opacity: 0; }
    100%   { opacity: 1; }
}

</style>