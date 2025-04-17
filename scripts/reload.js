import * as fs from 'fs';
import { exec } from 'child_process';
import { spawn } from 'child_process';

async function waitForFile(filePath, maxAttempts = 10, interval = 1000) {
    console.log(`Waiting for ${filePath} to be available...`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (fs.existsSync(filePath)) {
            console.log(`File ${filePath} found on attempt ${attempt}`);
            return true;
        }

        console.log(`Waiting for ${filePath} (attempt ${attempt}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, interval));
    }

    console.error(`File ${filePath} not found after ${maxAttempts} attempts`);
    return false;
}

async function ensureResourcesExist() {
    // First, wait for the build process to complete
    console.log('Waiting for build process to complete...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check if resources/core directory exists, create it if not
    if (!fs.existsSync('./resources/core')) {
        console.log('Creating resources/core directory...');
        fs.mkdirSync('./resources/core', { recursive: true });
    }

    // Check if resource.toml exists in src directory
    if (!fs.existsSync('./src/resource.toml')) {
        console.error('src/resource.toml does not exist!');
        return false;
    }

    // Copy resource.toml from src to resources/core if it doesn't exist
    if (!fs.existsSync('./resources/core/resource.toml')) {
        console.log('Copying resource.toml to resources/core...');
        fs.copyFileSync('./src/resource.toml', './resources/core/resource.toml');
    }

    return true;
}

async function isRpcServerRunning() {
    try {
        const response = await fetch('http://127.0.0.1:8787/server/status', {
            method: 'GET',
            signal: AbortSignal.timeout(2000), // 2 second timeout
        });
        return response.ok;
    } catch (error) {
        console.log('RPC server is not running or not responding');
        return false;
    }
}

async function reloadCore() {
    // Ensure all necessary resources exist
    const resourcesExist = await ensureResourcesExist();
    if (!resourcesExist) {
        console.error('Failed to ensure resources exist');
        return;
    }

    // Wait for resource.toml to be available
    const resourceTomlExists = await waitForFile('./resources/core/resource.toml');
    if (!resourceTomlExists) {
        console.error('Failed to find resource.toml after multiple attempts');
        return;
    }

    // Check if RPC server is running
    const rpcServerRunning = await isRpcServerRunning();

    if (rpcServerRunning) {
        try {
            console.log('Reloading core resource via RPC...');
            const response = await fetch('http://127.0.0.1:8787/server/reload?resource=core', {
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });

            if (response.ok) {
                console.log('Core resource reload request sent successfully');
            } else {
                console.error('Failed to reload core resource:', await response.text());
            }
        } catch (err) {
            console.error('Failed to reload core resource via RPC:', err);
            console.log('Will attempt to restart the server...');
        }
    } else {
        console.error('RPC server is not available; hot reload aborted.');
        return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

reloadCore();
