# Needle Engine — Framework Integration

## React

### Listen for 3D events in a component
```tsx
import { useEffect, useState } from "react";

function ScoreDisplay() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const ne = document.querySelector("needle-engine");
    const handler = (e: CustomEvent) => setScore(e.detail.score);
    ne?.addEventListener("score-changed", handler as EventListener);
    return () => ne?.removeEventListener("score-changed", handler as EventListener);
  }, []);

  return <div>Score: {score}</div>;
}
```

### Call into the 3D scene from React
```tsx
function GameControls() {
  const addScore = async () => {
    const { findObjectOfType } = await import("@needle-tools/engine");
    const { MyScoreManager } = await import("./scripts/MyScoreManager.js");
    findObjectOfType(MyScoreManager)?.addScore(10);
  };
  return <button onClick={addScore}>+10</button>;
}
```

### Use engine hooks from React
```tsx
useEffect(() => {
  import("@needle-tools/engine").then(({ onStart }) => {
    onStart((ctx) => {
      // safe to access components here
    });
  });
}, []);
```

---

## Svelte / SvelteKit

```svelte
<script>
  import { onMount } from "svelte";
  let score = 0;

  onMount(async () => {
    // Dynamic import required for SSR — engine needs browser APIs
    const { onStart } = await import("@needle-tools/engine");

    // onStart fires once when the context/scene is ready — never poll with setInterval
    onStart(ctx => {
      // Safe to access components, add components, etc.
      console.log("Scene ready:", ctx.scene);
    });

    // Listen for custom events from 3D components
    const ne = document.querySelector("needle-engine");
    const handler = (e) => (score = e.detail.score);
    ne?.addEventListener("score-changed", handler);
    return () => ne?.removeEventListener("score-changed", handler);
  });

  async function addScore() {
    const { findObjectOfType, Context } = await import("@needle-tools/engine");
    const { MyScoreManager } = await import("../scripts/MyScoreManager.js");
    findObjectOfType(MyScoreManager, Context.Current)?.addScore(10);
  }
</script>

<p>Score: {score}</p>
<button on:click={addScore}>+10</button>
<needle-engine src="assets/scene.glb" />
```

---

## Vue / Nuxt

```vue
<template>
  <div>Score: {{ score }}</div>
  <needle-engine src="assets/scene.glb" ref="ne" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const score = ref(0);
const ne = ref(null);

function onScore(e) { score.value = e.detail.score; }

onMounted(() => {
  ne.value?.addEventListener("score-changed", onScore);
  import("@needle-tools/engine").then(({ onStart }) => {
    onStart((ctx) => {
      // safe to access components here
    });
  });
});
onUnmounted(() => ne.value?.removeEventListener("score-changed", onScore));
</script>
```

---

## Vanilla JS / No Framework

```html
<needle-engine src="assets/scene.glb"></needle-engine>

<script type="module">
  import { onStart, onUpdate } from "@needle-tools/engine";

  onStart((ctx) => {
    console.log("Scene ready:", ctx.scene);
  });
</script>
```

---

## Engine Hooks Reference

These standalone functions from `@needle-tools/engine` mirror the component lifecycle but work outside of a class:

| Hook | When it fires |
|---|---|
| `onInitialized(cb)` | Once after context creation and first content load |
| `onStart(cb)` | Once when the context/scene is ready |
| `onUpdate(cb)` | Every frame (before rendering) |
| `onBeforeRender(cb)` | Just before Three.js renders |
| `onAfterRender(cb)` | Just after Three.js renders |
| `onClear(cb)` | Before context is cleared (e.g. when `src` changes) |
| `onDestroy(cb)` | When the context is torn down |

All callbacks receive `(ctx: Context)` as their argument.

### Client-only (no SSR)
When server-side rendering is **disabled**, import and call hooks directly:
```ts
import { onStart, onUpdate, onBeforeRender, onDestroy } from "@needle-tools/engine";

onStart((ctx) => { /* setup */ });
onUpdate((ctx) => { /* per-frame logic */ });
onDestroy((ctx) => { /* cleanup */ });
```

### With SSR (Next.js, SvelteKit, Nuxt, etc.)
`@needle-tools/engine` depends on WebGL / browser APIs and **cannot be imported on the server**. Use a dynamic import so the module is only loaded client-side (same pattern as with any three.js-based engine):
```ts
import("@needle-tools/engine").then(({ onStart, onUpdate, onDestroy }) => {
  onStart((ctx) => { /* setup */ });
  onUpdate((ctx) => { /* per-frame logic */ });
  onDestroy((ctx) => { /* cleanup */ });
});
```
