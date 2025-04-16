import { useCallback } from 'react';

export function useMessenger() {
    const send = useCallback((channel: string, data: any) => {
        if (typeof window !== 'undefined') {
            if (window.alt && typeof window.alt.emit === 'function') {
                window.alt.emit(channel, data);
            } else {
                window.parent.postMessage({ channel, data }, '*');
            }
        }
    }, []);

    const on = useCallback((channel: string, handler: (data: any) => void) => {
        const listener = (e: MessageEvent) => {
            if (e.data && e.data.channel === channel) {
                handler(e.data.data);
            }
        };
        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, []);

    return { send, on };
}
