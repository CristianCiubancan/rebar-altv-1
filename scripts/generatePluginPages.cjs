const fs = require('fs');
const path = require('path');

// Directories
const pluginsDir = path.resolve(__dirname, '../src/plugins');
const pagesDir = path.resolve(__dirname, '../webview/src/pages/plugins');
const dataDir = path.resolve(__dirname, '../webview/src/data');

// Ensure directories exist
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Collect plugin names
const pluginNames = fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// Generate an Astro page for each plugin
pluginNames.forEach((name) => {
    const astroPath = path.join(pagesDir, `${name}.astro`);
    const astroContent = `---
import AppLayout from '../../components/AppLayout.tsx';
import Draggable from '../../components/Draggable.tsx';
import Page from '@Plugins/${name}/Page.tsx';
export const prerender = true;
---
<AppLayout>
  <Draggable>
    <Page client:load />
  </Draggable>
</AppLayout>`;
    fs.writeFileSync(astroPath, astroContent);
});

// Emit pluginPages list
const dataPath = path.join(dataDir, 'pluginPages.ts');
const dataContent = `export const pluginPages = ${JSON.stringify(pluginNames)};\n`;
fs.writeFileSync(dataPath, dataContent);
