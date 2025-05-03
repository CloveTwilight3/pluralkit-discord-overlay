# Development Guide

This document explains how to set up your development environment for the PluralKit Discord Overlay.

## Setup Options

You can develop this project either directly on your local machine or using Docker.

## Local Development

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/CloveTwilight3/clove-nytrix-doughmination-twilight.git
   cd clove-nytrix-doughmination-twilight
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up pre-commit hooks:
   ```bash
   npm run prepare
   ```

### Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Using Docker

### Prerequisites
- Docker
- Docker Compose

### Development

Start the development environment:
```bash
docker-compose up dev
```

The development server will be available at http://localhost:5173 and will automatically reload when you make changes to the source code.

### Production Build

Build and run the production version:
```bash
docker-compose up prod
```

The production build will be available at http://localhost:5000.

## Project Structure

```
/
├── src/
│   ├── api/            # API integrations
│   ├── components/     # React components
│   ├── controllers/    # Business logic
│   ├── store/          # State management
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   └── index.tsx       # Entry point
├── public/             # Static assets
├── .husky/             # Git hooks
├── Dockerfile          # Production Docker configuration
├── Dockerfile.dev      # Development Docker configuration
└── docker-compose.yml  # Docker Compose configuration
```

## Pre-commit Hooks

This project uses Husky and lint-staged to run checks before commits:

- ESLint for code quality
- Prettier for code formatting

These checks run automatically when you commit changes.

## Building for Different Discord Client Mods

```bash
# Build for all platforms
npm run build:all

# Build for BetterDiscord
npm run build:bd

# Build for Vencord
npm run build:vencord

# Build for Powercord
npm run build:powercord
```

The build output will be in the `dist` directory.