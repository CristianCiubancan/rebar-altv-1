async function reloadWebview() {
    try {
        await fetch('http://127.0.0.1:8787/server/reload?resource=webview');
    } catch (err) {}

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

reloadWebview();
