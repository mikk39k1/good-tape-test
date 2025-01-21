import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite"; // Add loadEnv import
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.goodtape.io',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    },

    define: {
      'process.env': env
    },

    envDir: '.',

    envPrefix: ['VITE_', 'PUBLIC_'],
  };
});