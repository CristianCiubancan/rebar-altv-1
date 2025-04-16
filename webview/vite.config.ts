import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@Client': path.resolve(__dirname, '../src/main/client'),
            '@Server': path.resolve(__dirname, '../src/main/server'),
            '@Shared': path.resolve(__dirname, '../src/main/shared'),
            '@Plugins': path.resolve(__dirname, '../src/plugins'),
            '@Composables': path.resolve(__dirname, './composables'),
            '@Components': path.resolve(__dirname, './components'),
        },
    },
});
