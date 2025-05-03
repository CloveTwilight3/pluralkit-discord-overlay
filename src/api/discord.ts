import { DiscordUser, VoiceChannel, VoiceState, DiscordMessage } from '../types/discord';

/**
 * Discord API integration for client modifications
 * This module handles interactions with the Discord client
 */

// Module globals
let isInitialized = false;
let currentUserId: string | null = null;
let currentVoiceChannel: VoiceChannel | null = null;
let voiceUsers = new Map<string, DiscordUser>();
let eventListeners = new Map<string, Set<Function>>();

/**
 * Event types supported by this module
 */
export enum DiscordEventType {
  VOICE_CHANNEL_JOIN = 'voice_channel_join',
  VOICE_CHANNEL_LEAVE = 'voice_channel_leave',
  USER_JOIN_VOICE = 'user_join_voice',
  USER_LEAVE_VOICE = 'user_leave_voice',
  VOICE_STATE_UPDATE = 'voice_state_update',
  MESSAGE_RECEIVED = 'message_received',
  READY = 'ready',
}

/**
 * Initialize Discord API integration
 * @returns Promise that resolves when initialization is complete
 */
export const initialize = async (): Promise<boolean> => {
  if (isInitialized) return true;
  
  try {
    // Check if we're in a Discord client environment
    if (!window.DiscordNative && !window.BdApi && !window.powercord && !window.Vencord) {
      console.error('Discord client modification API not found');
      return false;
    }
    
    // Determine which client mod we're using and hook into it
    if (window.BdApi) {
      await initBetterDiscord();
    } else if (window.Vencord?.Webpack) {
      await initVencord();
    } else if (window.powercord?.api) {
      await initPowercord();
    } else {
      console.error('Unsupported Discord client modification');
      return false;
    }
    
    isInitialized = true;
    emit(DiscordEventType.READY, null);
    return true;
    
  } catch (error) {
    console.error('Failed to initialize Discord API integration:', error);
    return false;
  }
};

/**
 * Initialize with BetterDiscord
 */
const initBetterDiscord = async () => {
  const { Webpack } = window.BdApi;
  
  // Get required Discord modules
  const UserStore = Webpack.getModule(m => m?.getName?.() === 'UserStore');
  const ChannelStore = Webpack.getModule(m => m?.getName?.() === 'ChannelStore');
  const VoiceStateStore = Webpack.getModule(m => m?.getName?.() === 'VoiceStateStore');
  const MessageStore = Webpack.getModule(m => m?.getName?.() === 'MessageStore');
  
  // Get current user ID
  currentUserId = UserStore.getCurrentUser().id;
  
  // Hook into voice state updates
  Webpack.getModule(m => m?.default?.getName?.() === 'SoundManager')?.default
    .addObserver('voiceStateUpdate', handleVoiceStateUpdate);
    
  // Watch for new messages
  BdApi.Patcher.before('PluralKitOverlay', MessageStore, 'receiveMessage', 
    (_, [channelId, message]) => {
      handleMessageReceived(channelId, message);
    }
  );
  
  // Initialize with current voice state if already in a channel
  const currentVoiceState = VoiceStateStore.getVoiceStatesForGuild(
    VoiceStateStore.getGuildId()
  )?.[currentUserId];
  
  if (currentVoiceState?.channelId) {
    const channel = ChannelStore.getChannel(currentVoiceState.channelId);
    if (channel) {
      handleVoiceChannelJoin(channel);
    }
  }
};

/**
 * Initialize with Vencord
 */
const initVencord = async () => {
  const { webpack } = window.Vencord;
  
  // Get required Discord modules using Vencord's webpack
  const UserStore = await webpack.waitForModule(m => m?.default?.getCurrentUser);
  const ChannelStore = await webpack.waitForModule(m => m?.default?.getChannel);
  const VoiceStateStore = await webpack.waitForModule(m => m?.default?.getVoiceStatesForGuild);
  
  // Get current user ID
  currentUserId = UserStore.default.getCurrentUser().id;
  
  // Hook into voice state updates using Vencord's event system
  const Dispatcher = await webpack.waitForModule(m => m?.default?.subscribe);
  Dispatcher.default.subscribe('VOICE_STATE_UPDATE', handleVoiceStateUpdate);
  Dispatcher.default.subscribe('MESSAGE_CREATE', ({ message }) => {
    handleMessageReceived(message.channel_id, message);
  });
  
  // Initialize with current voice state if already in a channel
  const currentVoiceState = VoiceStateStore.default.getVoiceStatesForGuild(
    VoiceStateStore.default.getGuildId()
  )?.[currentUserId];
  
  if (currentVoiceState?.channelId) {
    const channel = ChannelStore.default.getChannel(currentVoiceState.channelId);
    if (channel) {
      handleVoiceChannelJoin(channel);
    }
  }
};

/**
 * Initialize with Powercord
 */
const initPowercord = async () => {
  const { webpack } = window.powercord.api;
  
  // Get required Discord modules using Powercord's webpack
  const UserStore = await webpack.getModule(['getCurrentUser']);
  const ChannelStore = await webpack.getModule(['getChannel']);
  const VoiceStateStore = await webpack.getModule(['getVoiceStates']);
  
  // Get current user ID
  currentUserId = UserStore.getCurrentUser().id;
  
  // Hook into voice state updates using Powercord's event system
  const Dispatcher = await webpack.getModule(['dispatch', 'subscribe']);
  Dispatcher.subscribe('VOICE_STATE_UPDATE', handleVoiceStateUpdate);
  Dispatcher.subscribe('MESSAGE_CREATE', ({ message }) => {
    handleMessageReceived(message.channel_id, message);
  });
  
  // Initialize with current voice state if already in a channel
  const currentVoiceState = VoiceStateStore.getVoiceStates(
    VoiceStateStore.getGuildId()
  )?.[currentUserId];
  
  if (currentVoiceState?.channelId) {
    const channel = ChannelStore.getChannel(currentVoiceState.channelId);
    if (channel) {
      handleVoiceChannelJoin(channel);
    }
  }
};

/**
 * Handle voice state update events
 */
const handleVoiceStateUpdate = (event: any) => {
  if (!event || !currentUserId) return;
  
  // Extract user ID and channel ID from the event
  // (Format varies between client mods, so we handle different possibilities)
  const userId = event.userId || event.user?.id || event.id;
  const channelId = event.channelId || event.channel?.id;
  const oldChannelId = event.oldChannelId || event.old?.channelId;
  
  // Skip if we don't have valid IDs
  if (!userId) return;
  
  // Current user joined a voice channel
  if (userId === currentUserId && channelId && oldChannelId !== channelId) {
    const channel = getChannel(channelId);
    if (channel) {
      handleVoiceChannelJoin(channel);
    }
  }
  
  // Current user left a voice channel
  if (userId === currentUserId && !channelId && oldChannelId) {
    handleVoiceChannelLeave();
  }
  
  // Another user joined the current voice channel
  if (userId !== currentUserId && channelId === currentVoiceChannel?.id && oldChannelId !== channelId) {
    const user = getUser(userId);
    if (user) {
      handleUserJoinVoice(user);
    }
  }
  
  // Another user left the current voice channel
  if (userId !== currentUserId && oldChannelId === currentVoiceChannel?.id && channelId !== oldChannelId) {
    handleUserLeaveVoice(userId);
  }
  
  // Emit the raw event for advanced handling
  emit(DiscordEventType.VOICE_STATE_UPDATE, event);
};

/**
 * Handle joining a voice channel
 */
const handleVoiceChannelJoin = (channel: VoiceChannel) => {
  currentVoiceChannel = channel;
  voiceUsers.clear();
  
  // Get all users in the voice channel
  const users = getVoiceChannelUsers(channel.id);
  users.forEach(user => {
    voiceUsers.set(user.id, user);
  });
  
  // Emit event
  emit(DiscordEventType.VOICE_CHANNEL_JOIN, {
    channel,
    users: Array.from(voiceUsers.values())
  });
};

/**
 * Handle leaving a voice channel
 */
const handleVoiceChannelLeave = () => {
  const channel = currentVoiceChannel;
  currentVoiceChannel = null;
  voiceUsers.clear();
  
  // Emit event
  emit(DiscordEventType.VOICE_CHANNEL_LEAVE, { channel });
};

/**
 * Handle a user joining the current voice channel
 */
const handleUserJoinVoice = (user: DiscordUser) => {
  if (!currentVoiceChannel) return;
  voiceUsers.set(user.id, user);
  
  // Emit event
  emit(DiscordEventType.USER_JOIN_VOICE, {
    channel: currentVoiceChannel,
    user
  });
};

/**
 * Handle a user leaving the current voice channel
 */
const handleUserLeaveVoice = (userId: string) => {
  if (!currentVoiceChannel) return;
  const user = voiceUsers.get(userId);
  voiceUsers.delete(userId);
  
  // Emit event
  emit(DiscordEventType.USER_LEAVE_VOICE, {
    channel: currentVoiceChannel,
    userId,
    user
  });
};

/**
 * Handle receiving a message
 */
const handleMessageReceived = (channelId: string, message: DiscordMessage) => {
  // Emit event
  emit(DiscordEventType.MESSAGE_RECEIVED, {
    channelId,
    message
  });
};

/**
 * Add an event listener
 */
export const addEventListener = (event: DiscordEventType, callback: Function): void => {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event)?.add(callback);
};

/**
 * Remove an event listener
 */
export const removeEventListener = (event: DiscordEventType, callback: Function): void => {
  eventListeners.get(event)?.delete(callback);
};

/**
 * Emit an event to all listeners
 */
export const emit = (event: DiscordEventType, data: any): void => {
  eventListeners.get(event)?.forEach(callback => {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error in ${event} event listener:`, error);
    }
  });
};

// Utility functions to interact with Discord

/**
 * Get a Discord user by ID
 */
export const getUser = (userId: string): DiscordUser | null => {
  try {
    if (window.BdApi) {
      return window.BdApi.Webpack.getModule(m => m?.getName?.() === 'UserStore')
        .getUser(userId);
    } else if (window.Vencord?.Webpack) {
      const UserStore = window.Vencord.Webpack.findModule(m => m?.default?.getUser);
      return UserStore?.default?.getUser(userId);
    } else if (window.powercord?.api?.webpack) {
      const UserStore = window.powercord.api.webpack.getModule(['getUser']);
      return UserStore?.getUser(userId);
    }
  } catch (error) {
    console.error('Failed to get user:', error);
  }
  return null;
};

/**
 * Get a Discord channel by ID
 */
export const getChannel = (channelId: string): VoiceChannel | null => {
  try {
    if (window.BdApi) {
      return window.BdApi.Webpack.getModule(m => m?.getName?.() === 'ChannelStore')
        .getChannel(channelId);
    } else if (window.Vencord?.Webpack) {
      const ChannelStore = window.Vencord.Webpack.findModule(m => m?.default?.getChannel);
      return ChannelStore?.default?.getChannel(channelId);
    } else if (window.powercord?.api?.webpack) {
      const ChannelStore = window.powercord.api.webpack.getModule(['getChannel']);
      return ChannelStore?.getChannel(channelId);
    }
  } catch (error) {
    console.error('Failed to get channel:', error);
  }
  return null;
};

/**
 * Get all users in a voice channel
 */
export const getVoiceChannelUsers = (channelId: string): DiscordUser[] => {
  try {
    let userIds: string[] = [];
    
    if (window.BdApi) {
      const VoiceStates = window.BdApi.Webpack.getModule(m => m?.getName?.() === 'VoiceStateStore')
        .getVoiceStatesForChannel(channelId);
      userIds = Object.keys(VoiceStates || {});
    } else if (window.Vencord?.Webpack) {
      const VoiceStateStore = window.Vencord.Webpack.findModule(m => m?.default?.getVoiceStatesForChannel);
      const VoiceStates = VoiceStateStore?.default?.getVoiceStatesForChannel(channelId);
      userIds = Object.keys(VoiceStates || {});
    } else if (window.powercord?.api?.webpack) {
      const VoiceStateStore = window.powercord.api.webpack.getModule(['getVoiceStatesForChannel']);
      const VoiceStates = VoiceStateStore?.getVoiceStatesForChannel(channelId);
      userIds = Object.keys(VoiceStates || {});
    }
    
    // Get user objects for all IDs
    return userIds
      .map(id => getUser(id))
      .filter((user): user is DiscordUser => user !== null);
      
  } catch (error) {
    console.error('Failed to get voice channel users:', error);
    return [];
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = (): DiscordUser | null => {
  try {
    if (window.BdApi) {
      return window.BdApi.Webpack.getModule(m => m?.getName?.() === 'UserStore')
        .getCurrentUser();
    } else if (window.Vencord?.Webpack) {
      const UserStore = window.Vencord.Webpack.findModule(m => m?.default?.getCurrentUser);
      return UserStore?.default?.getCurrentUser();
    } else if (window.powercord?.api?.webpack) {
      const UserStore = window.powercord.api.webpack.getModule(['getCurrentUser']);
      return UserStore?.getCurrentUser();
    }
  } catch (error) {
    console.error('Failed to get current user:', error);
  }
  return null;
};

/**
 * Get the current voice channel
 */
export const getCurrentVoiceChannel = (): VoiceChannel | null => {
  return currentVoiceChannel;
};

/**
 * Get all users in the current voice channel
 */
export const getCurrentVoiceUsers = (): DiscordUser[] => {
  return Array.from(voiceUsers.values());
};

/**
 * Check if a user is in the current voice channel
 */
export const isUserInVoiceChannel = (userId: string): boolean => {
  return voiceUsers.has(userId);
};

/**
 * Send a message to a channel
 */
export const sendMessage = async (channelId: string, content: string): Promise<boolean> => {
  try {
    if (window.BdApi) {
      const MessageActions = window.BdApi.Webpack.getModule(m => m?.getName?.() === 'MessageActions');
      await MessageActions.sendMessage(channelId, { content });
      return true;
    } else if (window.Vencord?.Webpack) {
      const MessageActions = await window.Vencord.Webpack.waitForModule(m => m?.default?.sendMessage);
      await MessageActions.default.sendMessage(channelId, { content });
      return true;
    } else if (window.powercord?.api?.webpack) {
      const MessageActions = await window.powercord.api.webpack.getModule(['sendMessage']);
      await MessageActions.sendMessage(channelId, { content });
      return true;
    }
  } catch (error) {
    console.error('Failed to send message:', error);
  }
  return false;
};

// Export the Discord API
export const DiscordAPI = {
  initialize,
  addEventListener,
  removeEventListener,
  getUser,
  getChannel,
  getVoiceChannelUsers,
  getCurrentUser,
  getCurrentVoiceChannel,
  getCurrentVoiceUsers,
  isUserInVoiceChannel,
  sendMessage,
};

export default DiscordAPI;

// Type declarations for Discord client mods (for TypeScript)
declare global {
  interface Window {
    BdApi?: {
      Webpack: {
        getModule: (filter: Function) => any;
      };
      Patcher: {
        before: (id: string, obj: any, method: string, callback: Function) => void;
        after: (id: string, obj: any, method: string, callback: Function) => void;
        unpatchAll: (id: string) => void;
      };
    };
    Vencord?: {
      Webpack: {
        findModule: (filter: Function) => any;
        waitForModule: (filter: Function) => Promise<any>;
      };
    };
    powercord?: {
      api: {
        webpack: {
          getModule: (filter: string[] | Function) => any;
        };
      };
    };
    DiscordNative?: any;
  }
}