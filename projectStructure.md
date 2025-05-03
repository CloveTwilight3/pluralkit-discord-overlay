# Project Structure

```
pluralkit-discord-overlay/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── api/
│   │   ├── discord.ts          # Discord API integration
│   │   ├── pluralkit.ts        # PluralKit API integration
│   │   └── index.ts            # API exports
│   ├── components/
│   │   ├── App.tsx             # Main application component
│   │   ├── ConnectionManager/  # System connection management UI
│   │   ├── Overlay/            # Voice channel overlay components
│   │   ├── Settings/           # Settings panel components
│   │   └── UI/                 # Reusable UI components
│   ├── hooks/
│   │   ├── useDiscord.ts       # Discord client hook
│   │   ├── usePluralKit.ts     # PluralKit API hook
│   │   └── useSettings.ts      # Settings management hook
│   ├── store/
│   │   ├── connections.ts      # System connections state
│   │   ├── overlay.ts          # Overlay display state
│   │   ├── settings.ts         # User settings state
│   │   └── index.ts            # Store exports
│   ├── types/
│   │   ├── discord.ts          # Discord API types
│   │   ├── pluralkit.ts        # PluralKit API types
│   │   └── index.ts            # Type exports
│   ├── utils/
│   │   ├── clientMods.ts       # Client modification utilities
│   │   ├── storage.ts          # Local storage utilities
│   │   └── helpers.ts          # General helper functions
│   ├── index.tsx               # Entry point
│   └── vite-env.d.ts           # Vite environment types
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore file
├── .prettierrc                 # Prettier configuration
├── LICENSE                     # MIT License
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Key Directories

### `/src/api`
Contains API integrations for both Discord and PluralKit. The Discord API handles voice channel events and user identification, while the PluralKit API manages system authentication, fronter information, and privacy settings.

### `/src/components`
React components organized by feature:
- `Overlay`: Components that display fronting information in voice channels
- `ConnectionManager`: UI for connecting to systems
- `Settings`: Configuration panels for systems and singlets
- `UI`: Reusable UI components like buttons, inputs, and modals

### `/src/store`
State management using Zustand for:
- User settings
- System connections
- Overlay display preferences
- Current voice channel information

### `/src/types`
TypeScript type definitions for:
- Discord API responses
- PluralKit API schemas
- Application state
- Configuration options

### `/src/utils`
Utility functions for:
- Client modification integration
- Local storage management
- API request helpers
- Security and authentication