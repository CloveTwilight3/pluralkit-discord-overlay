# PluralKit Discord Overlay

A Discord client modification that displays PluralKit system fronting information in voice channels.

## Features

- **Automatic Fronter Display**: See who is fronting in systems when you join a voice channel
- **Privacy Focused**: Systems control who can see their fronting information
- **Multiple Connection Methods**:
  - **Automatic Mode**: Connect to systems that have given you access
  - **Manual Mode**: Connect directly via system ID (with system permission)
- **Support for Both**:
  - **Systems**: Set up the overlay for your own system and control access
  - **Singlets**: Connect to systems that have granted you access

## Installation

1. Download the latest release from the [Releases](https://github.com/clovetwilight3/pluralkit-discord-overlay/releases) page
2. Install the overlay according to your Discord client modification method:
   - BetterDiscord: Place the `.plugin.js` file in your plugins folder
   - Vencord: Add the repository URL in the plugins settings
   - Powercord: Clone this repository to your powercord plugins folder

## Usage

### For Systems

1. Open the overlay settings by clicking the PluralKit icon in your Discord toolbar
2. Enter your PluralKit system token to authenticate
3. Configure which users/systems can see your fronting information
4. Enable the overlay

### For Singlets

1. Open the overlay settings by clicking the PluralKit icon in your Discord toolbar
2. Use Automatic Mode to connect to systems that have granted you access
3. Use Manual Mode to manually add system IDs (requires the system to have granted you access)

## Configuration

The overlay provides several configuration options:

- **Display Style**: Customize how fronting information appears
- **Privacy Settings**: Control who can see your system's fronting information
- **Update Frequency**: Set how often the overlay refreshes fronting information
- **Connection Management**: View and manage your connected systems

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pluralkit-discord-overlay.git
   cd pluralkit-discord-overlay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building

Build the project for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing code style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- PluralKit for their API and service for plural systems
- The Discord client modification community

## Privacy Notice

This application uses the PluralKit API to fetch system and member information. All data is stored locally and is never shared with any third parties. Systems have full control over who can access their fronting information.