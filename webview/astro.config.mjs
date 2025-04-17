import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    vite: {
        resolve: {
            alias: {
                '@Client': path.resolve(__dirname, '../src/main/client'),
                '@Server': path.resolve(__dirname, '../src/main/server'),
                '@Shared': path.resolve(__dirname, '../src/main/shared'),
                '@Plugins': path.resolve(__dirname, '../src/plugins'),
                '@Composables': path.resolve(__dirname, './src/composables'),
                '@Components': path.resolve(__dirname, './src/components'),
            },
        },
        optimizeDeps: {
            exclude: ['@altv/types-webview', '@altv/types-shared'],
        },
    },
    build: {
        outDir: '../resources/webview',
        emptyOutDir: false,
    },
    publicDir: 'public',
    integrations: [react()],
});
