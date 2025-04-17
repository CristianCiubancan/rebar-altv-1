import { createRequire } from 'module';
const require = createRequire(import.meta.url);
(async () => {
    try {
        require('./generatePluginPages.cjs');
    } catch (err) {
        console.error('Error generating plugin pages:', err);
    }
})();
