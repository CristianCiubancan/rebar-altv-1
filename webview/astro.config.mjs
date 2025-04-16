import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
    build: {
        outDir: '../resources/webview',
        emptyOutDir: false,
    },
    publicDir: 'public',
    integrations: [react()],
});
