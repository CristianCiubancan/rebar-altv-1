import { useEffect } from 'react';

/**
 * Hook to subscribe to Alt:V client events or postMessage events.
 */
export function useEvents(channel: string, handler: (data: any) => void) {
    useEffect(() => {
        // Browser messaging
        const listener = (event: MessageEvent) => {
            if (event.data?.channel === channel) {
                handler(event.data.data);
            }
        };
        window.addEventListener('message', listener);

        // Alt:V messaging
        if (window.alt?.on) {
            window.alt.on(channel, handler);
        }

        return () => {
            window.removeEventListener('message', listener);
            if (window.alt?.off) {
                window.alt.off(channel, handler);
            }
        };
    }, [channel, handler]);
}
