import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FronterDisplay, SystemInfo } from '../types/pluralkit';
import { DiscordUser } from '../types/discord';

/**
 * Display style for the overlay
 */
export enum OverlayDisplayStyle {
  MINIMAL = 'minimal',    // Just the fronter name
  STANDARD = 'standard',  // Fronter name and avatar
  DETAILED = 'detailed',  // Fronter name, avatar, and system info
}

/**
 * Position for the overlay
 */
export enum OverlayPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  CUSTOM = 'custom',
}

/**
 * State for the overlay
 */
interface OverlayState {
  // Display settings
  enabled: boolean;
  displayStyle: OverlayDisplayStyle;
  position: OverlayPosition;
  customPosition: { x: number; y: number } | null;
  showSystemName: boolean;
  showMemberColor: boolean;
  darkMode: boolean;
  opacity: number;
  scale: number;
  
  // Current data
  visible: boolean;
  isInVoiceChannel: boolean;
  currentVoiceChannelId: string | null;
  fronterDisplays: FronterDisplay[];
  
  // Actions
  setEnabled: (enabled: boolean) => void;
  setDisplayStyle: (style: OverlayDisplayStyle) => void;
  setPosition: (position: OverlayPosition) => void;
  setCustomPosition: (position: { x: number; y: number } | null) => void;
  setShowSystemName: (show: boolean) => void;
  setShowMemberColor: (show: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  setOpacity: (opacity: number) => void;
  setScale: (scale: number) => void;
  
  setVisible: (visible: boolean) => void;
  setIsInVoiceChannel: (isInVoiceChannel: boolean) => void;
  setCurrentVoiceChannelId: (channelId: string | null) => void;
  
  updateFronterDisplay: (display: FronterDisplay) => void;
  removeFronterDisplay: (systemId: string, discordUserId: string) => void;
  clearFronterDisplays: () => void;
}

/**
 * Create the overlay store with persistence
 */
export const useOverlayStore = create<OverlayState>()(
  persist(
    (set) => ({
      // Default display settings
      enabled: true,
      displayStyle: OverlayDisplayStyle.STANDARD,
      position: OverlayPosition.TOP_RIGHT,
      customPosition: null,
      showSystemName: true,
      showMemberColor: true,
      darkMode: false,
      opacity: 0.9,
      scale: 1.0,
      
      // Default state
      visible: false,
      isInVoiceChannel: false,
      currentVoiceChannelId: null,
      fronterDisplays: [],
      
      // Actions for settings
      setEnabled: (enabled) => set({ enabled }),
      setDisplayStyle: (displayStyle) => set({ displayStyle }),
      setPosition: (position) => set({ position }),
      setCustomPosition: (customPosition) => set({ customPosition }),
      setShowSystemName: (showSystemName) => set({ showSystemName }),
      setShowMemberColor: (showMemberColor) => set({ showMemberColor }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setOpacity: (opacity) => set({ opacity }),
      setScale: (scale) => set({ scale }),
      
      // Actions for state
      setVisible: (visible) => set({ visible }),
      setIsInVoiceChannel: (isInVoiceChannel) => set({ isInVoiceChannel }),
      setCurrentVoiceChannelId: (currentVoiceChannelId) => set({ currentVoiceChannelId }),
      
      // Actions for fronter displays
      updateFronterDisplay: (display) => set((state) => {
        // Find if we already have a display for this system+user
        const index = state.fronterDisplays.findIndex(
          (fd) => fd.systemId === display.systemId && fd.discordUserId === display.discordUserId
        );
        
        if (index >= 0) {
          // Update existing display
          const newDisplays = [...state.fronterDisplays];
          newDisplays[index] = display;
          return { fronterDisplays: newDisplays };
        } else {
          // Add new display
          return { fronterDisplays: [...state.fronterDisplays, display] };
        }
      }),
      
      removeFronterDisplay: (systemId, discordUserId) => set((state) => ({
        fronterDisplays: state.fronterDisplays.filter(
          (fd) => !(fd.systemId === systemId && fd.discordUserId === discordUserId)
        )
      })),
      
      clearFronterDisplays: () => set({ fronterDisplays: [] }),
    }),
    {
      name: 'pluralkit-overlay-settings',
      partialize: (state) => ({
        // Only persist settings, not runtime state
        enabled: state.enabled,
        displayStyle: state.displayStyle,
        position: state.position,
        customPosition: state.customPosition,
        showSystemName: state.showSystemName,
        showMemberColor: state.showMemberColor,
        darkMode: state.darkMode,
        opacity: state.opacity,
        scale: state.scale,
      }),
    }
  )
);

/**
 * Interface for overlay controller
 */
export interface OverlayController {
  initialize: () => Promise<void>;
  refreshFronterDisplays: () => Promise<void>;
  handleVoiceChannelJoin: (channelId: string, users: DiscordUser[]) => Promise<void>;
  handleUserJoinVoiceChannel: (channelId: string, user: DiscordUser) => Promise<void>;
  handleUserLeaveVoiceChannel: (channelId: string, userId: string) => void;
  handleVoiceChannelLeave: () => void;
}

export default useOverlayStore;