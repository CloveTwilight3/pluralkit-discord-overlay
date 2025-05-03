import { 
  ConnectionType, 
  ConnectedSystem,
  SystemAccess,
  AccessLevel 
} from '../types/pluralkit';
import useConnectionsStore, { ConnectionsController } from '../store/connections';
import PluralKitAPI from '../api/pluralkit';
import DiscordAPI from '../api/discord';

/**
 * Controller for managing PluralKit system connections
 */
class ConnectionsControllerImpl implements ConnectionsController {
  /**
   * Initialize the connections controller
   */
  public async initialize(): Promise<void> {
    try {
      // Check if we already have an own system token
      const { ownSystem } = useConnectionsStore.getState();
      
      if (ownSystem?.token) {
        // Verify the token is still valid
        const systemInfo = await PluralKitAPI.getSelfSystem(ownSystem.token);
        
        if (systemInfo && systemInfo.id === ownSystem.id) {
          // Update system info with latest data
          useConnectionsStore.getState().setOwnSystem({
            ...ownSystem,
            name: systemInfo.name,
            lastUpdated: new Date().toISOString(),
          });
          
          console.log('Own system authenticated:', systemInfo.name);
        } else {
          // Token is invalid, clear it
          useConnectionsStore.getState().setOwnSystem(null);
          console.warn('Stored system token is invalid, cleared');
        }
      }
      
      // Refresh all system connections
      await this.refreshSystemConnections();
      
      console.log('Connections controller initialized');
    } catch (error) {
      console.error('Failed to initialize connections controller:', error);
    }
  }
  
  /**
   * Authenticate the user's own system with a token
   */
  public async authenticateOwnSystem(token: string): Promise<boolean> {
    try {
      // Validate the token and get system info
      const systemInfo = await PluralKitAPI.getSelfSystem(token);
      
      if (!systemInfo || !systemInfo.id) {
        console.error('Invalid system token');
        return false;
      }
      
      // Create own system record
      const ownSystem: ConnectedSystem = {
        id: systemInfo.id,
        name: systemInfo.name,
        connectionType: ConnectionType.AUTOMATIC,
        lastUpdated: new Date().toISOString(),
        token: token,
      };
      
      // Update store
      useConnectionsStore.getState().setOwnSystem(ownSystem);
      
      console.log('Own system authenticated:', systemInfo.name);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }
  
  /**
   * Disconnect the user's own system
   */
  public async disconnectOwnSystem(): Promise<void> {
    useConnectionsStore.getState().setOwnSystem(null);
    console.log('Own system disconnected');
  }
  
  /**
   * Connect to a PluralKit system
   */
  public async connectToSystem(
    systemId: string,
    connectionType: ConnectionType
  ): Promise<boolean> {
    try {
      // Check if we have permission to connect
      const canConnect = await this.checkSystemConnectionPermission(systemId);
      
      if (!canConnect) {
        console.error('No permission to connect to system:', systemId);
        return false;
      }
      
      // Get system info
      const systemInfo = await PluralKitAPI.getSystem(systemId);
      
      if (!systemInfo || !systemInfo.id) {
        console.error('Invalid system ID:', systemId);
        return false;
      }
      
      // Create connected system record
      const connectedSystem: ConnectedSystem = {
        id: systemInfo.id,
        name: systemInfo.name,
        connectionType,
        lastUpdated: new Date().toISOString(),
      };
      
      // Update store
      useConnectionsStore.getState().addConnectedSystem(connectedSystem);
      
      console.log('Connected to system:', systemInfo.name);
      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }
  
  /**
   * Disconnect from a PluralKit system
   */
  public async disconnectFromSystem(systemId: string): Promise<void> {
    useConnectionsStore.getState().removeConnectedSystem(systemId);
    console.log('Disconnected from system:', systemId);
  }
  
  /**
   * Check if we have permission to connect to a system
   */
  private async checkSystemConnectionPermission(
    systemId: string
  ): Promise<boolean> {
    try {
      // Get current Discord user
      const currentUser = DiscordAPI.getCurrentUser();
      if (!currentUser) {
        console.error('Failed to get current Discord user');
        return false;
      }
      
      // Check if we have an own system token
      const { ownSystem } = useConnectionsStore.getState();
      
      if (ownSystem?.token) {
        // Try to check permission with token
        const permission = await PluralKitAPI.checkViewerPermission(
          systemId,
          currentUser.id,
          ownSystem.token
        );
        
        return permission;
      } else {
        // Try to check permission without token
        const permission = await PluralKitAPI.checkViewerPermission(
          systemId,
          currentUser.id
        );
        
        return permission;
      }
    } catch (error) {
      console.error('Failed to check system connection permission:', error);
      return false;
    }
  }
  
  /**
   * Refresh all system connections
   */
  public async refreshSystemConnections(): Promise<void> {
    try {
      // Get current Discord user
      const currentUser = DiscordAPI.getCurrentUser();
      if (!currentUser) {
        console.error('Failed to get current Discord user');
        return;
      }
      
      // Get own system token
      const { ownSystem, connectedSystems } = useConnectionsStore.getState();
      
      if (ownSystem?.token) {
        // Get allowed viewers for own system
        const allowedViewers = await PluralKitAPI.getAllowedViewers(ownSystem.token);
        
        // Update own system allowed viewers
        // (This is just for own reference, not used in the app)
        console.log('Own system allowed viewers:', allowedViewers);
        
        // Get systems that have granted access to this user
        try {
          // This endpoint doesn't exist in the actual PluralKit API,
          // we're simulating it for this implementation
          // In a real app, this would need a different approach
          
          // For demonstration purposes, we'll update connected systems
          // that are set to auto-connect
          for (const system of connectedSystems) {
            if (system.connectionType === ConnectionType.AUTOMATIC) {
              // Check if we still have permission
              const hasPermission = await this.checkSystemConnectionPermission(
                system.id
              );
              
              if (hasPermission) {
                // Update system info
                const systemInfo = await PluralKitAPI.getSystem(system.id);
                
                if (systemInfo && systemInfo.id) {
                  useConnectionsStore.getState().updateConnectedSystem(
                    system.id,
                    {
                      name: systemInfo.name,
                      lastUpdated: new Date().toISOString(),
                    }
                  );
                  
                  console.log('Updated connected system:', systemInfo.name);
                }
              } else {
                // We lost permission, remove the connection
                useConnectionsStore.getState().removeConnectedSystem(system.id);
                console.log('Removed system connection due to lost permission:', system.id);
              }
            }
          }
        } catch (error) {
          console.error('Failed to get systems with access:', error);
        }
      }
    } catch (error) {
      console.error('Failed to refresh system connections:', error);
    }
  }
}

// Create and export the controller instance
export const connectionsController = new ConnectionsControllerImpl();
export default connectionsController;