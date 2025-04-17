import * as alt from 'alt-server';
import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';

const app = new Hono<{ Bindings: HttpBindings }>();

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:rpcRestart': () => void;
    }
}

// Simple status endpoint to check if RPC server is running
app.get('/status', (c) => {
    return c.json({ status: 'ok', timestamp: Date.now() });
});

// 127.0.0.1:8787/server/restart
app.get('/restart', (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    alt.log(`RPC - Restart Invoked`);
    for (let player of alt.Player.all) {
        player.kick();
    }

    alt.emit('rebar:rpcRestart');

    c.status(200);
    return c.json({ data: 'ok' });
});

// 127.0.0.1:8787/server/reload?resource=core
app.get('/reload', async (c) => {
    const { resource } = c.req.query();
    if (!resource) {
        c.status(400);
        return c.json({ data: 'Resource name is required' });
    }

    // Check if resource exists, but don't fail if it doesn't (it might be in the process of being created)
    if (!alt.hasResource(resource)) {
        alt.logWarning(`RPC - Resource '${resource}' does not exist yet, will attempt to load it`);
    }

    alt.log(`RPC - Restarting Resource '${resource}'`);
    alt.emit('rebar:rpcRestart');

    await alt.Utils.wait(1000); // Increased wait time to ensure resources are ready

    // Set hotreload flag before restarting resources
    alt.setMeta('hotreload', true);

    try {
        // For webview resource, we need special handling to preserve player connections
        if (resource === 'webview') {
            // Store current player states before reloading
            const onlinePlayers = alt.Player.all;
            for (let player of onlinePlayers) {
                // Temporarily freeze players during reload to prevent issues
                player.frozen = true;
            }

            // Restart the webview resource
            if (alt.hasResource(resource)) {
                alt.restartResource(resource);
            } else {
                alt.logWarning(`Resource '${resource}' not found, attempting to start it`);
                alt.startResource(resource);
            }

            // Wait a moment for the resource to fully restart
            await alt.Utils.wait(1000);

            // Unfreeze players
            for (let player of alt.Player.all) {
                player.frozen = false;
            }
        } else {
            // For core resource, also reload webview
            if (resource === 'core') {
                if (alt.hasResource('webview')) {
                    alt.restartResource('webview');
                } else {
                    alt.logWarning(`Resource 'webview' not found, attempting to start it`);
                    alt.startResource('webview');
                }
            }

            // Restart the requested resource
            if (alt.hasResource(resource)) {
                alt.restartResource(resource);
            } else {
                alt.logWarning(`Resource '${resource}' not found, attempting to start it`);
                alt.startResource(resource);
            }
        }
    } catch (error) {
        alt.logError(`Error restarting resource '${resource}':`, error);
        c.status(500);
        return c.json({ data: `Error restarting resource '${resource}': ${error.message}` });
    }

    c.status(200);
    return c.json({ data: `Resource '${resource}' reloaded` });
});

// 127.0.0.1:8787/server/stop
app.get('/stop', async (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    alt.log(`RPC - Server Stop Invoked`);

    for (let player of alt.Player.all) {
        player.kick();
    }

    await alt.Utils.wait(2000);

    alt.stopServer();

    c.status(200);
    return c.json({ data: 'ok' });
});

export function get() {
    return app;
}
