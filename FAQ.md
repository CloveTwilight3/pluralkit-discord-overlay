# Frequently Asked Questions

## General Questions

### What is the PluralKit Discord Overlay?

The PluralKit Discord Overlay is a client modification for Discord that displays information about who is currently fronting in plural systems when users are in voice channels. It integrates with the PluralKit API to fetch and display this information in real-time.

### Is this an official PluralKit project?

No, this is an independent project that uses the PluralKit API. It's not officially affiliated with PluralKit, but it's designed to work with their service.

### Is this plugin against Discord's Terms of Service (ToS)?

Client modifications in general exist in a gray area regarding Discord's Terms of Service. This plugin doesn't modify Discord's core functionality or provide unfair advantages, but users should be aware that Discord has historically discouraged client modifications. Use at your own discretion.

## Installation & Setup

### How do I install the overlay?

The installation process depends on which Discord client modification you use:

**BetterDiscord**:
1. Download the `.plugin.js` file from the Releases page
2. Place it in your BetterDiscord plugins folder
3. Enable the plugin in BetterDiscord settings

**Vencord**:
1. Go to Vencord settings
2. Add the repository URL in the plugins section
3. Enable the PluralKit Discord Overlay plugin

**Powercord**:
1. Clone the repository to your Powercord plugins folder
2. Restart Discord or run `powercord.pluginManager.remount("pluralkit-discord-overlay")`

### How do I set up the overlay for my system?

1. After installing, click the overlay settings icon in Discord
2. Go to the "System Connections" tab
3. Enter your PluralKit system token
4. Customize your display preferences in the "Display Settings" tab

### Where do I find my PluralKit system token?

You can get your system token by sending `pk;token` in a direct message to the PluralKit bot on Discord. Never share this token with anyone, as it provides access to manage your system.

## Usage

### Why isn't the overlay showing up?

There could be several reasons:
1. Make sure the overlay is enabled in settings
2. Verify you're in a voice channel
3. Check if you've authenticated your system or connected to other systems
4. Ensure the systems you're trying to see have granted you permission to view their fronting information

### Can I see fronting information for any system?

No. For privacy reasons, you can only see fronting information for:
1. Your own system (if you're authenticated)
2. Systems that have explicitly granted you access through PluralKit's privacy settings

### How do I grant someone permission to see my fronting information?

In PluralKit, use the command:
```
pk;privacy front private_with_whitelist
pk;privacy fronters add @username
```
Replace `@username` with the Discord user you want to grant access to.

### How often does the overlay update?

The overlay updates every 30 seconds by default. You can also manually refresh by reopening the settings panel.

## Troubleshooting

### The overlay isn't updating or showing incorrect information

Try these steps:
1. Refresh the overlay by toggling it off and on in settings
2. Restart Discord
3. Check if the PluralKit API is experiencing issues
4. Verify your system token is still valid

### I'm getting authentication errors

If you're having trouble authenticating your system:
1. Make sure your token is correct (send `pk;token` to the PluralKit bot again)
2. Check your internet connection
3. Ensure the PluralKit API is online
4. Try regenerating your token with `pk;token refresh`

### The overlay looks broken or misplaced

You can adjust the overlay appearance in settings:
1. Change the position (top-left, top-right, bottom-left, bottom-right, or custom)
2. Adjust the scale and opacity
3. Toggle between light and dark mode
4. Change the display style (minimal, standard, or detailed)

If it's still misplaced, try the "Custom" position setting and drag it to your preferred location.

## Privacy & Security

### Is my system token secure?

The system token is stored locally on your device with basic encryption. It is never sent to any servers other than the official PluralKit API. However, be aware that anyone with access to your computer could potentially access it.

### Can other users see my fronting information without permission?

No. The overlay respects PluralKit's privacy settings. If your fronting privacy is set to private or private_with_whitelist, only users you've explicitly granted access will be able to see your fronting information.

### What data does the overlay collect?

The overlay doesn't collect any data beyond what's necessary for its functionality. All data (system tokens, connections, settings) is stored locally on your device. No analytics or usage data is sent to any servers.

## Support & Feedback

### How do I report bugs or suggest features?

You can report bugs or suggest features by opening an issue on GitHub:
[GitHub Issues](https://github.com/CloveTwilight3/clove-nytrix-doughmination-twilight/issues)

### Is there a community for users of this overlay?

Currently, there's no dedicated community. You can discuss the overlay in the [PluralKit Support Server](https://discord.gg/PczBt78) or on the GitHub repository.

### How can I contribute to this project?

Contributions are welcome! Check out the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to the project.