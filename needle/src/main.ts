import("@needle-tools/engine") /* async import of needle engine */;

import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
    target: document.getElementById('app')!,
})
  
export default app;