import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const assetPackContent = `type = "asset-pack"\nclient-files = ["*"]`;

const assetPacks = [`./resources/images`, `./resources/sounds`, './resources/fonts', `./resources/webview`];

const foldersToClean = [
    `./resources/core`,
    `./resources/webview`,
    `./webview/public/images`,
    `./webview/public/sounds`,
    `./webview/public/fonts`,
    ...assetPacks,
];

const initialCommands = [
    `node ./scripts/generatePluginPages.cjs`,
    `pnpm -C webview run build`,
    `npx sucrase ./src -d ./resources/core --exclude-dirs ./src/scratchpad --transforms typescript,jsx -q`,
    `node ./scripts/env.js`,
    `node ./scripts/copyFiles.js`,
];

const finalCommands = [`node ./scripts/buildPluginImports.js`];

function formatTimestamp(time) {
    const date = new Date(time);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
        hour: hour <= 9 ? `0${hour}` : `${hour}`,
        minute: minutes <= 9 ? `0${minutes}` : `${minutes}`,
        second: seconds <= 9 ? `0${seconds}` : `${seconds}`,
    };
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
                return;
            }
            resolve(stdout);
        });
    });
}

function copyResourceFile() {
    // Ensure the directory exists before copying
    if (!fs.existsSync('./resources/core')) {
        fs.mkdirSync('./resources/core', { recursive: true });
    }
    fs.cpSync(`./src/resource.toml`, `./resources/core/resource.toml`, { force: true });
}

function createAssetPackTomls() {
    for (let path of assetPacks) {
        const fullPath = path + '/resource.toml';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        fs.writeFileSync(fullPath, assetPackContent);
    }
}

async function runCommands(commandList) {
    const promises = [];
    for (let cmd of commandList) {
        promises.push(execPromise(cmd));
    }

    const result = await Promise.all(promises).catch((err) => {
        console.error('Error executing commands:', err);
    });

    if (!result) {
        process.exit(1);
    }
}

function logMessage(msg) {
    const timestamp = formatTimestamp(Date.now());
    console.log(`[${timestamp.hour}:${timestamp.minute}:${timestamp.second}] ${msg}`);
}

async function compile() {
    const start = Date.now();
    logMessage(`Compile Started`);

    await runCommands([`node ./scripts/buildPluginDependencies.js`]);

    for (let pathsToClean of foldersToClean) {
        try {
            fs.rmSync(pathsToClean, { force: true, recursive: true });
        } catch (err) {}
    }

    // Create necessary directories
    for (let dir of ['./resources/core', './resources/webview']) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    createAssetPackTomls();

    if (!process.argv.includes('docker')) {
        initialCommands.push(`node ./scripts/pkill.js`);
    } else {
        logMessage(`Skipping process kill for Docker`);
    }

    await runCommands(initialCommands); // Transpile code, webview, copy files, etc.

    // Copy Astro webview build output into alt:V resource
    const webviewBuildDir = path.join(process.cwd(), 'webview', 'dist');
    const webviewResDir = path.join(process.cwd(), 'resources', 'webview');
    if (fs.existsSync(webviewBuildDir)) {
        fs.cpSync(webviewBuildDir, webviewResDir, { recursive: true });
    }

    // Ensure resource.toml is copied
    copyResourceFile(); // Copy resource file for core

    // Verify the resource.toml file was copied successfully
    if (!fs.existsSync('./resources/core/resource.toml')) {
        logMessage(`Warning: resource.toml was not copied to resources/core, attempting again...`);
        // Try one more time with a direct copy
        fs.copyFileSync('./src/resource.toml', './resources/core/resource.toml');
    }

    await runCommands(finalCommands); // Update file pathing

    // Run path resolver separately with more detailed logging
    logMessage('Running path resolver...');
    try {
        await execPromise('node ./scripts/pathResolver.js');
        logMessage('Path resolver completed successfully');
    } catch (error) {
        logMessage(`Error running path resolver: ${error.message}`);
    }

    logMessage(`Compile Time - ${Date.now() - start}ms`);

    // Add a small delay to ensure file system operations complete
    await new Promise((resolve) => setTimeout(resolve, 500));
}

compile();
