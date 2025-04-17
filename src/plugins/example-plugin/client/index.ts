import * as alt from 'alt-client';

alt.log('Example client plugin loaded successfully!');

// Basic functionality
alt.onServer('example:notification', (message) => {
    alt.log(`Received notification: ${message}`);
});
