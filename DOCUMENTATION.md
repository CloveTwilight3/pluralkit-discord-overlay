# PluralKit Discord Overlay Documentation

This document provides a comprehensive overview of the PluralKit Discord Overlay project, explaining its architecture, key components, and how to extend it.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Key Components](#key-components)
4. [Data Flow](#data-flow)
5. [Installation](#installation)
6. [Development](#development)
7. [Extending the Project](#extending-the-project)
8. [Troubleshooting](#troubleshooting)

## Project Overview

The PluralKit Discord Overlay is a client-side modification for Discord that provides visual indication of which members of a plural system are currently fronting in voice channels. It integrates with the PluralKit API to fetch and display fronting information for systems.

### Features

- Displays real-time fronting information for systems in voice channels
- Supports multiple connection methods (automatic and manual)
- Customizable display options
- Works for both systems and singlets
- Privacy-focused, respecting PluralKit's privacy settings

## Architecture

The project follows a modern React-based architecture with TypeScript for type safety. It uses:

- **React** for UI components
- **Zustand** for state management
- **Styled Components** for styling
- **Axios** for API requests
- **Vite** for building and bundling

### Core Architectural Patterns

The application is built using these foundational patterns:

1. **Store-Controller Pattern**: State management (Zustand stores) is separated from business logic (controllers)
2. **Component-Based UI**: UI is composed of reusable React components
3. **API Integration Layer**: PluralKit and Discord APIs are abstracted into clean interfaces

## Key Components

### API Layer

- `pluralkit.ts`: Handles all interactions with the PluralKit API
- `discord.ts`: Provides integration with Discord's internal APIs via client mods

### State Management

- `overlay.ts`: Manages overlay display state (position, style, visibility)
- `connections.ts`: Manages system connections and authentication

### Controllers

- `OverlayController`: Manages overlay functionality and real-time updates
- `ConnectionsController`: Manages system authentication and connections

### UI Components

- `Overlay`: Main overlay display component
- `FronterCard`: Displays individual system fronting information
- `SettingsPanel`: Configuration UI for the overlay
- `SystemConnectionManager`: UI for managing system connections

## Data Flow

Here's how data flows through the application:

1. **Discord Event Handling**:
   - Discord voice events → Discord API → OverlayController
   - Voice channel join/leave events trigger fronting info updates

2. **System Authentication**:
   - User token → ConnectionsController → PluralKit API → System information
   - Authenticated system is stored in the connections store

3. **Fronting Information**:
   - OverlayController → PluralKit API → Fronting data → Overlay store → UI components
   - Periodic refresh ensures fronting info stays current

## Installation

### For Users

#### BetterDiscord
1. Download the `.plugin.js` file from the Releases page
2. Place it in your BetterDiscord plugins folder
3. Enable the plugin in BetterDiscord settings

#### Vencord
1. Go to Vencord settings
2. Add the repository URL in the plugins section
3. Enable the PluralKit Discord Overlay plugin

#### Powercord
1. Clone the repository to your Powercord plugins folder
2. Restart Discord or run `powercord.pluginManager.remount("pluralkit-discord-overlay")`

### For Developers

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. The built files will be in the `dist` directory

## Development

### Project Structure

```
src/
├── api/                 # API integration
│   ├── discord.ts       # Discord API
│   └── pluralkit.ts     # PluralKit API
├── components/          # UI components
│   ├── App.tsx          # Main app component
│   ├── Overlay/         # Overlay components
│   └── Settings/        # Settings components
├── controllers/         # Business logic
│   ├── OverlayController.ts
│   └── ConnectionsController.ts
├── store/               # State management
│   ├── connections.ts
│   └── overlay.ts
├── types/               # TypeScript interfaces
│   ├── discord.ts
│   └── pluralkit.ts
└── utils/               # Helper functions
```

### Development Workflow

1. Run `npm run dev` to start the development server
2. Make changes to the code
3. Use the browser console to debug issues
4. Run `npm run build` to create a production build

## Extending the Project

### Adding New Features

To add new features to the overlay:

1. **Add State**: Extend the relevant store with new state and actions
2. **Add Logic**: Implement the feature logic in a controller
3. **Add UI**: Create or update UI components to use the new feature
4. **Connect Everything**: Connect state, logic, and UI

### Supporting New Discord Client Mods

To support a new Discord client modification:

1. Update `src/api/discord.ts` to detect and integrate with the new client mod
2. Add initialization code in `src/index.tsx` for the new client mod
3. Test thoroughly to ensure compatibility

## Troubleshooting

### Common Issues

#### The overlay doesn't appear in voice channels

- Make sure the overlay is enabled in settings
- Check if you have connected to at least one system
- Verify that you have permission to view fronting information for connected systems

#### Authentication fails

- Double-check your system token
- Ensure you have a stable internet connection
- Try regenerating your token in PluralKit if issues persist

#### The overlay appears in the wrong position

- Try changing the position setting in the overlay settings
- If using custom positioning, you can drag the overlay to a better position

### Debugging

- Check the browser console for error messages (Ctrl+Shift+I in Discord)
- Look for errors related to PluralKit API or Discord integration
- Enable verbose logging in the store by adding console logs to key actions

---

This documentation is a living document and will be updated as the project evolves.