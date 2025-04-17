# Astro‑React Rebar

This project is an Astro + React re‑implementation of the Rebar framework for alt:V. It preserves the original plugin architecture for server, client, RMLUI and webview pages.

---

## Project Structure

├── **src/**  
│ └── **plugins/**  
│ └── _your‑plugin_/  
│ ├── **server/** index.ts (Alt:V server entry)  
│ ├── **client/** index.ts (Alt:V client entry)  
│ ├── **rmlui/** index.html or _.rml (in‑game UI)  
│ └── Page.tsx (React component for webview)  
├── **resources/**  
│ └── **webview/** (built Astro site output)  
├── **scripts/**  
│ ├── buildPluginImports.js (collects server & client imports)  
│ ├── generatePluginPages.cjs (builds Astro pages + pluginPages.ts)  
│ └── webview.js (invokes page generator)  
├── **webview/** (Astro project)  
│ ├── astro.config.mjs (aliases `@Plugins`, `@Client`, `@Server`…)  
│ ├── src/components (AppLayout, Draggable, etc.)  
│ ├── src/pages/plugins/_.astro (generated per‑plugin)  
│ └── src/data/pluginPages.ts (exports plugin list)  
└── package.json, nodemon, config & build scripts

---

## Plugin Workflow

1. **Source**

    - Place your plugin under `src/plugins/<plugin-name>`.
    - Create subfolders `server`, `client`, optionally `rmlui`.
    - Provide a `Page.tsx` React component at the plugin root.

2. **Server & Client Bundling**

    - `scripts/buildPluginImports.js` scans `src/plugins/*` and appends imports to  
      `resources/core/main/server/plugins.js` and `resources/core/main/client/plugins.js`.
    - Disabled if a `.disable` file exists or folder name prefixed with `!`.

3. **Webview Pages**

    - `scripts/generatePluginPages.cjs` lists plugin directories and generates:
        - A `.astro` page in `webview/src/pages/plugins/<plugin>.astro`, importing your `Page.tsx`.
        - Updates `webview/src/data/pluginPages.ts` with an array of plugin names.
    - `scripts/webview.js` invokes the generator before running Astro.

4. **Aliases & Build**

    - In `webview/astro.config.mjs`, `@Plugins` points to `../src/plugins`,  
      `@Client`, `@Server`, `@Shared` mirror runtime code.
    - Astro builds to `resources/webview`, preserving webview assets for alt:V.

5. **Disable a Plugin**
    - Create an empty file `src/plugins/<plugin>/.disable`, or prefix the folder with `!`.

---

## Scripts & Commands

-   **Development**
    ```bash
    pnpm run dev          # nodemon server + webview:dev
    pnpm run webview:dev  # watch and serve Astro at localhost:3000
    ```
-   **Build & Run**
    ```bash
    pnpm run start        # compile TS, build webview, launch altv-server
    pnpm run build:docker # compile with Docker target
    ```
-   **Utilities**
    -   `pnpm run build:docker` – Docker‑packaged build
    -   `pnpm run binaries` – altv‑pkg binaries
    -   `pnpm run rebar:upgrade`– upgrade Rebar core

---

## Adding a New Plugin

1. Create `src/plugins/my-plugin/`
2. Add `server/index.ts` and `client/index.ts`.
3. (Optional) Add `rmlui/index.html` or `.rml` under `rmlui/`.
4. Export your webview UI in `Page.tsx`.
5. Run `pnpm run webview:dev` or `pnpm run start`.

---

## Configuration & Aliases

-   Customize environment via `.env` and `server.toml`.
-   Import paths in webview:
    ```ts
    import Page from '@Plugins/my-plugin/Page.tsx';
    import { useRebar } from '@Server';
    ```
-   Shared types from `@altv/types-*` are excluded from dependency optimization.

---

## References

-   Original documentation: `docs/` folder in this repo.
-   Astro config: `webview/astro.config.mjs`
-   Plugin import scripts: `scripts/buildPluginImports.js`, `scripts/generatePluginPages.cjs`
