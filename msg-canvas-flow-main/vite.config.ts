import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// If you use a custom plugin, import it here
// import componentTagger from 'your-plugin-path';

export default defineConfig(({ mode }) => {
  const useHttps = process.env.DEV_HTTPS === 'true';

  return {
    server: {
      host: "::",
      port: 3000,
      ...(useHttps
        ? {
            https: {
              key: fs.readFileSync('localhost-key.pem'),
              cert: fs.readFileSync('localhost-cert.pem'),
            },
          }
        : {}),
    },

    plugins: [
      react(),
      // Uncomment and fix the import if you use componentTagger
      // mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
