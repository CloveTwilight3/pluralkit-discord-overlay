import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'PluralKitDiscordOverlay',
      fileName: (format) => `pluralkit-discord-overlay.${format}.js`,
      formats: ['iife', 'es']
    },
    rollupOptions: {
      // Make sure to externalize dependencies that shouldn't be bundled
      external: ['react', 'react-dom'],
      output: {
        // Global variables to use in the IIFE/UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // Add banner for BetterDiscord compatibility
        banner: '/**\n * @name PluralKit-Discord-Overlay\n * @version 0.1.0\n * @description Displays PluralKit system fronting information in Discord voice channels\n * @author CloveTwilight3\n * @source https://github.com/CloveTwilight3/clove-nytrix-doughmination-twilight\n */\n'
      }
    },
    sourcemap: true,
    // Minify for production builds
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});