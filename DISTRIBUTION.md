# Distribution Guide

This document explains how to build and distribute the PluralKit Discord Overlay for different Discord client modifications.

## Table of Contents

1. [Building the Project](#building-the-project)
2. [BetterDiscord Distribution](#betterdiscord-distribution)
3. [Vencord Distribution](#vencord-distribution)
4. [Powercord Distribution](#powercord-distribution)
5. [Version Management](#version-management)

## Building the Project

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Building

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

This will generate files in the `dist` directory for different distribution formats.

## BetterDiscord Distribution

BetterDiscord requires plugins as a single `.plugin.js` file.

### Building for BetterDiscord

1. Run the BetterDiscord-specific build:
   ```bash
   npm run build:bd
   ```

2. This creates `dist/pluralkit-discord-overlay.plugin.js`

### Installing in BetterDiscord

1. Copy the `.plugin.js` file to BetterDiscord's plugins folder:
   - Windows: `%AppData%/BetterDiscord/plugins`
   - macOS: `~/Library/Application Support/BetterDiscord/plugins`
   - Linux: `~/.config/BetterDiscord/plugins`

2. Restart Discord or reload plugins in BetterDiscord settings

## Vencord Distribution

Vencord supports both local plugins and remote plugins.

### For Local Installation

1. Build the project:
   ```bash
   npm run build:vencord
   ```

2. Copy the output file to your Vencord plugins directory:
   - Typically: `path/to/vencord/src/userplugins/`

3. Restart Discord or reload Vencord

### For Remote Installation

1. Host the built files on a server or GitHub repository
2. Users can add the repository URL in Vencord settings:
   ```
   https://raw.githubusercontent.com/CloveTwilight3/clove-nytrix-doughmination-twilight/main/dist/pluralkit-discord-overlay.plugin.js
   ```

## Powercord Distribution

Powercord requires a plugin directory structure.

### Building for Powercord

1. Run the Powercord-specific build:
   ```bash
   npm run build:powercord
   ```

2. This creates a Powercord-compatible directory in `dist/powercord/`

### Installing in Powercord

1. Copy the generated directory to Powercord's plugins folder:
   ```bash
   cp -r dist/powercord/pluralkit-discord-overlay path/to/powercord/src/Powercord/plugins/
   ```

2. Restart Discord or run the following in the Discord console:
   ```js
   powercord.pluginManager.remount("pluralkit-discord-overlay")
   ```

## Version Management

### Updating the Version

1. Update the version in `package.json`
2. Update the version in the banner comment in `vite.config.ts`
3. Update the changelog in `CHANGELOG.md`

### Release Process

1. Build for all platforms:
   ```bash
   npm run build:all
   ```

2. Create a GitHub release with the built files
3. Update the documentation with new installation links

### Automatic Releases

The GitHub workflow in `.github/workflows/ci.yml` can automatically create releases when tags are pushed:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This will trigger the CI to build and create a release.