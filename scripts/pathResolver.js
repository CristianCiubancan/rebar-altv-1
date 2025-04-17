import glob from 'fast-glob';
import * as fs from 'fs';
import path from 'path';

function updatePaths(filePath) {
    console.log(`Processing file: ${filePath}`);

    try {
        // Normalize path for consistent handling
        const normalizedPath = filePath.replace(/\\/g, '/');
        const strippedPath = normalizedPath.replace('./resources/core/', './');
        const pathDepth = strippedPath.split('/').length - 2;
        const relativePath = `../`.repeat(pathDepth);

        // Read file content
        let file = fs.readFileSync(filePath, 'utf-8');

        // Replace all import paths
        file = file.replace(/\@Server/gm, `${relativePath}main/server`);
        file = file.replace(/\@Client/gm, `${relativePath}main/client`);
        file = file.replace(/\@Shared/gm, `${relativePath}main/shared`);
        file = file.replace(/\@Plugins/gm, `${relativePath}plugins`);
        file = file.replace(/\@Composables/gm, `${relativePath}../webview/composables`);
        file = file.replace(/\@Components/gm, `${relativePath}../webview/components`);

        // Write updated content back to file
        fs.writeFileSync(filePath, file);
        console.log(`Successfully updated paths in: ${filePath}`);
    } catch (error) {
        console.error(`Error updating paths in ${filePath}:`, error);
    }
}

async function updateFiles() {
    console.log('Starting path resolution process...');

    // Get all JS files in the resources/core directory
    const files = glob.sync('./resources/core/**/*.js');
    console.log(`Found ${files.length} files to process`);

    // Process each file
    for (let file of files) {
        updatePaths(file);
    }

    console.log('Path resolution completed');
}

updateFiles();
