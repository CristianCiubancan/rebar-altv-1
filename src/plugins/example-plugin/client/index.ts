import * as alt from 'alt-client';
import { useWebview } from '@Client/webview/index.js';

const webview = useWebview() as any;
let uiVisible = false;

function toggleUI() {
    if (uiVisible) {
        webview.hide('example-plugin');
        uiVisible = false;
        alt.log('Example UI hidden');
    } else {
        webview.show('example-plugin', 'page', true);
        uiVisible = true;
        alt.log('Example UI shown');
    }
}

alt.on('consoleCommand', (cmd) => {
    if (cmd === 'toggleexample') {
        toggleUI();
    }
});

alt.on('keyup', (key) => {
    if (key === 0x49) {
        toggleUI();
    }
});

alt.log('Example client plugin loaded successfully!');

// Basic functionality
alt.onServer('example:notification', (message) => {
    alt.log(`Received notification: ${message}`);
});
