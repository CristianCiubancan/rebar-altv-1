import * as alt from 'alt-server';

alt.log('Example plugin loaded successfully! (Updated again)');

// Basic functionality
alt.on('playerConnect', (player) => {
    alt.log(`Player connected: ${player.name}`);

    // Send a welcome message
    player.spawn(new alt.Vector3(0, 0, 72));
    alt.emitClient(player, 'example:notification', 'Welcome to the server!');

    // Add a chat command
    alt.log('Added chat command: /hello');
});
