import("@needle-tools/engine") /* async import of needle engine */;

import App from './App.svelte';

const app = new App({
    target: document.getElementById('app'),
})
  
export default app;