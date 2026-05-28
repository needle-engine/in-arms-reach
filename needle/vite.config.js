import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression2';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(async ({ command }) => {
    const { needlePlugins, useGzip, loadConfig } = await import("@needle-tools/engine/plugins/vite/index.js");
    const needleConfig = await loadConfig(); 
    const pwaOptions = {};
    return {
        base: "./",
        plugins: [
            basicSsl(),
            needlePlugins(command, needleConfig, { pwa: pwaOptions }),
            svelte(),
            VitePWA(pwaOptions),            
            useGzip(needleConfig) ? viteCompression({ deleteOriginFile: true }) : null,
        ],
        server: {
            https: true,
            proxy: { // workaround: specifying a proxy skips HTTP2 which is currently problematic in Vite since it causes session memory timeouts.
                'https://localhost:3000': 'https://localhost:3000'
            },
            strictPort: true,
            port: 3000
        },
        build: {
            outDir: "./dist",
            emptyOutDir: true,
            keepNames: true,
        }
    }
});