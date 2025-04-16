import { useState, useEffect } from 'react';

/**
 * Hook to sync Alt:V metadata values for a given key.
 * Listens to both window.alt events and postMessage channels.
 */
export function useSyncedMeta(key: string) {
    const [value, setValue] = useState(undefined as any);

    useEffect(() => {
        const channel = `meta:${key}`;

        // Browser messaging
        const listener = (event: MessageEvent) => {
            if (event.data?.channel === channel) {
                setValue(event.data.data);
            }
        };
        window.addEventListener('message', listener);

        // Alt:V messaging
        if (window.alt?.on) {
            window.alt.on(channel, (data: any) => {
                setValue(data);
            });
        }

        return () => {
            window.removeEventListener('message', listener);
            if (window.alt?.off) {
                window.alt.off(channel, listener);
            }
        };
    }, [key]);

    return value;
}
