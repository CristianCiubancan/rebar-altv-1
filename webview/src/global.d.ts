declare interface Window {
    /** Alt:V client API exposed in webview environment */
    alt?: {
        emit(channel: string, data: any): void;
        on(channel: string, handler: (data: any) => void): void;
        off(channel: string, handler: (data: any) => void): void;
    };
}
