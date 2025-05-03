import { DiscordUser } from '../types/discord';
import { FronterDisplay, SystemInfo } from '../types/pluralkit';
import useOverlayStore, { OverlayController } from '../store/overlay';
import useConnectionsStore from '../store/connections';
import DiscordAPI, { DiscordEventType } from '../api/discord';
import PluralKitAPI from '../api/pluralkit';

/**
 * Controller for the overlay functionality
 * Handles interaction between Discord, PluralKit, and the overlay UI
 */
class OverlayControllerImpl implements OverlayController {
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshInterval = 30000; // 30 seconds
  
  /**
   * Initialize the overlay controller
   */
  public async initialize(): Promise<void> {
    // Initialize the Discord API
    const initialized = await DiscordAPI.initialize();
    if (!initialized) {
      console.error('Failed to initialize Discord API');
      return;
    }
    
    // Set up event listeners
    DiscordAPI.addEventListener(
      DiscordEventType.VOICE_CHANNEL_JOIN,
      this.handleVoiceChannelJoinEvent.bind(this)
    );
    
    DiscordAPI.addEventListener(
      DiscordEventType.USER_JOIN_VOICE,
      this.handleUserJoinVoiceEvent.bind(this)
    );
    
    DiscordAPI.addEventListener(
      DiscordEventType.USER_LEAVE_VOICE,
      this.handleUserLeaveVoiceEvent.bind(this)
    );
    
    DiscordAPI.addEventListener(
      DiscordEventType.VOICE_CHANNEL_LEAVE,
      this.handleVoiceChannelLeaveEvent.bind(this)
    );
    
    // If already in a voice channel, handle it
    const currentChannel = DiscordAPI.getCurrentVoiceChannel();
    if (currentChannel) {
      const users = DiscordAPI.getCurrentVoiceUsers();
      await this.handleVoiceChannelJoin(currentChannel.id, users);
    }
    
    // Start refresh timer
    this.startRefreshTimer();
    
    console.log('Overlay controller initialized');
  }
  
  /**
   * Start the refresh timer to periodically update fronter information
   */
  private startRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    
    this.refreshTimer = setInterval(
      this.refreshFronterDisplays.bind(this),
      this.refreshInterval
    );
  }
  
  /**
   * Stop the refresh timer
   */
  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  
  /**
   * Handle Discord voice channel join event
   */
  private async handleVoiceChannelJoinEvent(event: any): Promise<void> {
    const { channel, users } = event;
    await this.handleVoiceChannelJoin(channel.id, users);
  }
  
  /**
   * Handle Discord user join voice event
   */
  private async handleUserJoinVoiceEvent(event: any): Promise<void> {
    const { channel, user } = event;
    await this.handleUserJoinVoiceChannel(channel.id, user);
  }
  
  /**
   * Handle Discord user leave voice event
   */
  private handleUserLeaveVoiceEvent(event: any): void {
    const { channel, userId } = event;
    this.handleUserLeaveVoiceChannel(channel.id, userId);
  }
  
  /**
   * Handle Discord voice channel leave event
   */
  private handleVoiceChannelLeaveEvent(): void {
    this.handleVoiceChannelLeave();
  }
  
  /**
   * Handle joining a voice channel
   */
  public async handleVoiceChannelJoin(
    channelId: string,
    users: DiscordUser[]
  ): Promise<void> {
    // Update store state
    useOverlayStore.setState({
      visible: true,
      isInVoiceChannel: true,
      currentVoiceChannelId: channelId,
    });
    
    // Clear existing fronter displays
    useOverlayStore.getState().clearFronterDisplays();
    
    // Process all users in the channel
    for (const user of users) {
      await this.checkUserForSystem(user);
    }
  }
  
  /**
   * Handle a user joining the voice channel
   */
  public async handleUserJoinVoiceChannel(
    channelId: string,
    user: DiscordUser
  ): Promise<void> {
    // Check if this is the current voice channel
    if (useOverlayStore.getState().currentVoiceChannelId !== channelId) {
      return;
    }
    
    // Check if the user is associated with a system
    await this.checkUserForSystem(user);
  }
  
  /**
   * Handle a user leaving the voice channel
   */
  public handleUserLeaveVoiceChannel(channelId: string, userId: string): void {
    // Check if this is the current voice channel
    if (useOverlayStore.getState().currentVoiceChannelId !== channelId) {
      return;
    }
    
    // Remove any fronter displays for this user
    const displays = useOverlayStore.getState().fronterDisplays;
    for (const display of displays) {
      if (display.discordUserId === userId) {
        useOverlayStore
          .getState()
          .removeFronterDisplay(display.systemId, userId);
      }
    }
  }
  
  /**
   * Handle leaving a voice channel
   */
  public handleVoiceChannelLeave(): void {
    // Update store state
    useOverlayStore.setState({
      visible: false,
      isInVoiceChannel: false,
      currentVoiceChannelId: null,
    });
    
    // Clear fronter displays
    useOverlayStore.getState().clearFronterDisplays();
    
    // Stop refresh timer
    this.stopRefreshTimer();
  }
  
  /**
   * Check if a Discord user is associated with a PluralKit system
   */
  private async checkUserForSystem(user: DiscordUser): Promise<void> {
    // Get connected systems
    const connectionsStore = useConnectionsStore.getState();
    const connectedSystems = [
      ...(connectionsStore.ownSystem ? [connectionsStore.ownSystem] : []),
      ...connectionsStore.connectedSystems,
    ];
    
    // Check each system
    for (const system of connectedSystems) {
      try {
        // Try to get current fronters for this system and Discord user
        const fronters = await PluralKitAPI.getCurrentFronters(
          system.id,
          system.token
        );
        
        // If we got fronters and they're not private
        if (fronters.members.length > 0 && !fronters.private) {
          // Create fronter display
          const display: FronterDisplay = {
            systemId: system.id,
            systemName: system.name,
            members: fronters.members,
            timestamp: fronters.timestamp,
            discordUserId: user.id,
          };
          
          // Update the store
          useOverlayStore.getState().updateFronterDisplay(display);
        }
      } catch (error) {
        console.error(
          `Failed to get fronters for system ${system.id} and user ${user.id}:`,
          error
        );
      }
    }
  }
  
  /**
   * Refresh all fronter displays
   */
  public async refreshFronterDisplays(): Promise<void> {
    // Check if we're in a voice channel
    if (!useOverlayStore.getState().isInVoiceChannel) {
      return;
    }
    
    // Get all users in the voice channel
    const channelId = useOverlayStore.getState().currentVoiceChannelId;
    if (!channelId) return;
    
    const users = DiscordAPI.getVoiceChannelUsers(channelId);
    
    // Process each user
    for (const user of users) {
      await this.checkUserForSystem(user);
    }
  }
}

// Create and export the controller instance
export const overlayController = new OverlayControllerImpl();
export default overlayController;