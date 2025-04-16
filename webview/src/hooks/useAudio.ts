import { useEffect, useRef } from 'react';

/**
 * Hook to play audio via HTMLAudioElement or Alt:V sound API.
 * @param src - audio file URL or identifier
 * @param options.loop - whether to loop
 * @param options.volume - volume level (0.0–1.0)
 */
export function useAudio(src: string, options: { loop?: boolean; volume?: number } = {}) {
    const audioRef = useRef<HTMLAudioElement>();

    useEffect(() => {
        // Browser audio
        const audio = new Audio(src);
        audio.loop = options.loop ?? false;
        audio.volume = options.volume ?? 1.0;
        audioRef.current = audio;

        // Alt:V sound (if available)
        if (window.alt && typeof window.alt.emit === 'function') {
            window.alt.emit('webview:playSound', { src, options });
        } else {
            audio.play().catch(() => {});
        }

        return () => {
            if (window.alt && typeof window.alt.emit === 'function') {
                window.alt.emit('webview:stopSound', { src });
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, [src, options.loop, options.volume]);

    return {
        play: () => {
            if (window.alt && typeof window.alt.emit === 'function') {
                window.alt.emit('webview:playSound', { src, options });
            } else {
                audioRef.current?.play();
            }
        },
        stop: () => {
            if (window.alt && typeof window.alt.emit === 'function') {
                window.alt.emit('webview:stopSound', { src });
            } else {
                audioRef.current?.pause();
                audioRef.current!.currentTime = 0;
            }
        },
    };
}
