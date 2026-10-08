import {
  generateManifestIcons,
  pluginUpdateIcons,
} from "@jenesei-software/jenesei-plugin-vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import path from "path";
import process from "process";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const env = loadEnv("", process.cwd());
  const VITE_DEFAULT_NAME = env.VITE_DEFAULT_NAME;
  const VITE_DEFAULT_NAMESHORT = env.VITE_DEFAULT_NAMESHORT;
  const VITE_DEFAULT_THEME_COLOR = env.VITE_DEFAULT_THEME_COLOR;
  const VITE_DEFAULT_DESCRIPTION = env.VITE_DEFAULT_DESCRIPTION;
  const VITE_BASE_URL = env.VITE_BASE_URL;

  const environmentValue = env.VITE_NODE_ENV ?? "prod";
  if (!["prod", "dev", "test"].includes(environmentValue)) {
    throw new Error(
      `VITE_NODE_ENV must be one of prod, dev, test. Got: ${environmentValue}`,
    );
  }
  const environment = environmentValue as "prod" | "dev" | "test";

  const robotsMode: Record<"prod" | "dev" | "test", { meta: string }> = {
    prod: {
      meta: "noindex, nofollow",
    },
    dev: {
      meta: "index, nofollow",
    },
    test: {
      meta: "noindex, nofollow",
    },
  };

  const sizesBackgroundTransparent = [
    57, 64, 72, 76, 114, 120, 144, 152, 180, 192, 256, 384, 512,
  ];
  const sizesBackgroundWhite: number[] = [];
  const sizesFavicon = [64];

  const require = createRequire(import.meta.url);
  const pkg = require("./package.json") as { version: string };

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    server: {
      host: "local.dev.jenesei.ru",
      port: 3000,
    },
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
            if (id.includes("src/pages")) {
              const page = id.split("src/pages/")[1].split("/")[0];
              return `page-${page}`;
            }
            if (id.includes("src/layouts")) {
              const layout = id.split("src/layouts/")[1].split("/")[0];
              return `layout-${layout}`;
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "@local": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      pluginUpdateIcons({
        pathInputFile: path.resolve(
          __dirname,
          "public/logos/logo-jenesei-id.png",
        ),
        pathOutputDirectory: path.resolve(__dirname, "public/icons"),
        prefix: "icon",
        sizesBackgroundTransparent: sizesBackgroundTransparent,
        sizesBackgroundWhite: sizesBackgroundWhite,
        sizesFavicon: sizesFavicon,
      }),
      createHtmlPlugin({
        minify: true,
        entry: "src/main.tsx",
        template: "index.html",
        inject: {
          data: {
            title: VITE_DEFAULT_NAMESHORT,
            robotsMeta: robotsMode[environment].meta,
            icon57: `/icons/icon-57x57.png`,
            icon72: `/icons/icon-72x72.png`,
            icon76: `/icons/icon-76x76.png`,
            icon114: `/icons/icon-114x114.png`,
            icon120: `/icons/icon-120x120.png`,
            icon144: `/icons/icon-144x144.png`,
            icon152: `/icons/icon-152x152.png`,
            icon180: `/icons/icon-180x180.png`,

            icon64Fav: `/icons/icon-64x64-favicon.ico`,
          },
        },
      }),
      react(),
      basicSsl(),
      VitePWA({
        filename: "vite-sw.js", //!!! НИКОГДА НЕ МЕНЯТЬ !!!
        strategies: "generateSW",
        registerType: "prompt",
        includeManifestIcons: false,
        injectRegister: null,
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,json}"],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${VITE_BASE_URL}/.*$`),
              handler: "NetworkOnly",
            },
            {
              urlPattern: /build-info\.txt$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "version-cache",
                expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
        manifest: {
          display: "standalone",
          orientation: "portrait",
          name: VITE_DEFAULT_NAME,
          short_name: VITE_DEFAULT_NAMESHORT,
          theme_color: VITE_DEFAULT_THEME_COLOR,
          background_color: VITE_DEFAULT_THEME_COLOR,
          description: VITE_DEFAULT_DESCRIPTION,
          start_url: "/",
          icons: generateManifestIcons({
            path: "icons",
            prefix: "icon",
            sizesBackgroundWhite: [],
            sizesBackgroundTransparent: sizesBackgroundTransparent,
            sizesFavicon: sizesFavicon,
          }),
        },
      }),
    ],
  };
});
