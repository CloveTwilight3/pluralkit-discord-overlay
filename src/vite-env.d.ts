/// <reference types="vite/client" />

// Discord client mod type extensions
interface Window {
  BdApi?: any;
  Vencord?: any;
  powercord?: any;
  DiscordNative?: any;
  __VENCORD_PLUGINS__?: any[];
}

// Prevent TypeScript errors when importing CSS modules
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Allow importing SVG files
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Allow importing image files
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}