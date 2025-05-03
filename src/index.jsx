import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

/**
 * PluralKit Discord Overlay
 * A Discord client modification that displays PluralKit system fronting information in voice channels
 * 
 * Author: CloveTwilight3
 * Version: 0.1.0
 */

/**
 * Main entry point for the application
 * Creates container and renders the app
 */
const main = () => {
  // Create container for the app
  const container = document.createElement('div');
  container.id = 'pluralkit-overlay-container';
  document.body.appendChild(container);
  
  // Set up React root
  const root = createRoot(container);
  root.render(<App />);
  
  console.log('PluralKit Discord Overlay loaded');
  
  // Return cleanup function for client mods
  return () => {
    root.unmount();
    container.remove();
    console.log('PluralKit Discord Overlay unloaded');
  };
};

// Integration with different Discord client mods

// BetterDiscord
if (typeof window.BdApi !== 'undefined') {
  module.exports = class PluralKitOverlay {
    start() {
      this.stop = main();
    }
    
    stop() {
      if (this.stop) {
        this.stop();
        this.stop = null;
      }
    }
  };
}

// Vencord
if (typeof window.Vencord !== 'undefined') {
  // For Vencord plugins
  const PluralKitOverlayPlugin = {
    name: 'PluralKitOverlay',
    description: 'Displays PluralKit system fronting information in voice channels',
    authors: [{ name: 'CloveTwilight3', id: '0' }],
    start: () => {},
    stop: () => {},
  };
  
  PluralKitOverlayPlugin.start = main;
  
  // @ts-ignore
  if (typeof window.__VENCORD_PLUGINS__ !== 'undefined') {
    // @ts-ignore
    window.__VENCORD_PLUGINS__.push(PluralKitOverlayPlugin);
  }
}

// Powercord
if (typeof window.powercord !== 'undefined') {
  // For Powercord plugins
  const { Plugin } = window.powercord.entities;
  
  class PluralKitOverlayPlugin extends Plugin {
    async startPlugin() {
      this.unload = main();
    }
    
    pluginWillUnload() {
      if (this.unload) {
        this.unload();
      }
    }
  }
  
  // @ts-ignore
  module.exports = PluralKitOverlayPlugin;
}

// Direct initialization (e.g., for development)
if (
  typeof window.BdApi === 'undefined' &&
  typeof window.Vencord === 'undefined' &&
  typeof window.powercord === 'undefined'
) {
  // Check if we're in a Discord environment
  if (document.querySelector('[class*="app-"]')) {
    console.log('Initializing PluralKit Discord Overlay directly');
    main();
  } else {
    console.warn('PluralKit Discord Overlay must be run in Discord');
  }
}