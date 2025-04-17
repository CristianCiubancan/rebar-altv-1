import * as alt from 'alt-server';

alt.on('playerConnect', (player) => {
    alt.log('Example Plugin (Server): Player connected');
});
