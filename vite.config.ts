import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Version information
const pkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkgJson.version;
const name = pkgJson.name;
const description = pkgJson.description;
const author = pkgJson.author;
const repoUrl = pkgJson.repository.url.replace('git+', '').replace('.git', '');

// BetterDiscord metadata
const bdMeta = `/**
 * @name PluralKit-Discord-Overlay
 * @version ${version}
 * @description ${description}
 * @author ${author}
 * @source ${repoUrl}
 * @website ${repoUrl}
 */
`;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Base configuration
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };

  // Mode-specific configurations
  switch (mode) {
    case 'betterdiscord':
      return {
        ...config,
        build: {
          outDir: 'dist',
          lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name: 'PluralKitDiscordOverlay',
            fileName: () => 'pluralkit-discord-overlay.plugin.js',
            formats: ['iife']
          },
          rollupOptions: {
            output: {
              banner: bdMeta,
              extend: true
            }
          },
          sourcemap: false,
          minify: false
        }
      };

    case 'vencord':
      return {
        ...config,
        build: {
          outDir: 'dist/vencord',
          lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name: 'PluralKitDiscordOverlay',
            fileName: () => 'index.js',
            formats: ['iife']
          },
          rollupOptions: {
            output: {
              banner: `// ${name} v${version}\n// ${description}\n`,
              extend: true
            }
          },
          sourcemap: true,
          minify: 'terser'
        }
      };

    case 'powercord':
      // Create Powercord manifest
      const pcManifest = {
        name: 'PluralKit Discord Overlay',
        description,
        version,
        author,
        license: 'MIT',
        repo: repoUrl.replace('https://github.com/', ''),
        main: 'index.js'
      };

      // Ensure the powercord directory exists
      const pcDir = path.resolve(__dirname, 'dist/powercord/pluralkit-discord-overlay');
      if (!fs.existsSync(pcDir)) {
        fs.mkdirSync(pcDir, { recursive: true });
      }

      // Write the manifest.json
      fs.writeFileSync(
        path.resolve(pcDir, 'manifest.json'),
        JSON.stringify(pcManifest, null, 2)
      );

      // Copy the README.md
      fs.copyFileSync(
        path.resolve(__dirname, 'README.md'),
        path.resolve(pcDir, 'README.md')
      );

      return {
        ...config,
        build: {
          outDir: 'dist/powercord/pluralkit-discord-overlay',
          lib: {
            entry: path.resolve(__dirname, 'src/index.tsx'),
            name: 'PluralKitDiscordOverlay',
            fileName: () => 'index.js',
            formats: ['iife']
          },
          rollupOptions: {
            output: {
              banner: `// ${name} v${version}\n// ${description}\n`,
              extend: true
            }
          },
          sourcemap: true,
          minify: 'terser'
        }
      };

    default:
      // Default build (standard library)
      return {
        ...config,
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
              // Add banner
              banner: `// ${name} v${version}\n// ${description}\n`
            }
          },
          sourcemap: true,
          minify: 'terser',
          terserOptions: {
            format: {
              comments: false
            }
          }
        }
      };
  }
});