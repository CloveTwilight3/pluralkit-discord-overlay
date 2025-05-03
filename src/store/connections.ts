import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ConnectedSystem, 
  ConnectionType, 
  SystemAccess,
  AccessLevel
} from '../types/pluralkit';

/**
 * State for system connections
 */
interface ConnectionsState {
  // The user's own system (if they are a system)
  ownSystem: ConnectedSystem | null;
  
  // Connected systems
  connectedSystems: ConnectedSystem[];
  
  // Systems that have granted access to this user
  allowedSystems: SystemAccess[];
  
  // Actions for own system
  setOwnSystem: (system: ConnectedSystem | null) => void;
  
  // Actions for connected systems
  addConnectedSystem: (system: ConnectedSystem) => void;
  updateConnectedSystem: (systemId: string, updates: Partial<ConnectedSystem>) => void;
  removeConnectedSystem: (systemId: string) => void;
  
  // Actions for allowed systems
  addAllowedSystem: (access: SystemAccess) => void;
  updateSystemAccess: (systemId: string, updates: Partial<SystemAccess>) => void;
  removeAllowedSystem: (systemId: string) => void;
  
  // Check if we can connect to a system
  canConnectToSystem: (systemId: string) => boolean;
  
  // Get a connected system (including own system)
  getConnectedSystem: (systemId: string) => ConnectedSystem | null;
  
  // Get access level for a system
  getSystemAccessLevel: (systemId: string) => AccessLevel;
}

/**
 * Create the connections store with persistence
 */
export const useConnectionsStore = create<ConnectionsState>()(
  persist(
    (set, get) => ({
      // Initial state
      ownSystem: null,
      connectedSystems: [],
      allowedSystems: [],
      
      // Actions for own system
      setOwnSystem: (system) => set({ ownSystem: system }),
      
      // Actions for connected systems
      addConnectedSystem: (system) => set((state) => {
        // Check if system already exists
        const exists = state.connectedSystems.some(
          (s) => s.id === system.id
        );
        
        if (exists) {
          // Update existing system
          return {
            connectedSystems: state.connectedSystems.map((s) =>
              s.id === system.id ? { ...s, ...system } : s
            ),
          };
        } else {
          // Add new system
          return {
            connectedSystems: [...state.connectedSystems, system],
          };
        }
      }),
      
      updateConnectedSystem: (systemId, updates) => set((state) => ({
        connectedSystems: state.connectedSystems.map((system) =>
          system.id === systemId ? { ...system, ...updates } : system
        ),
      })),
      
      removeConnectedSystem: (systemId) => set((state) => ({
        connectedSystems: state.connectedSystems.filter(
          (system) => system.id !== systemId
        ),
      })),
      
      // Actions for allowed systems
      addAllowedSystem: (access) => set((state) => {
        // Check if system already exists
        const exists = state.allowedSystems.some(
          (s) => s.systemId === access.systemId
        );
        
        if (exists) {
          // Update existing system
          return {
            allowedSystems: state.allowedSystems.map((s) =>
              s.systemId === access.systemId ? { ...s, ...access } : s
            ),
          };
        } else {
          // Add new system
          return {
            allowedSystems: [...state.allowedSystems, access],
          };
        }
      }),
      
      updateSystemAccess: (systemId, updates) => set((state) => ({
        allowedSystems: state.allowedSystems.map((access) =>
          access.systemId === systemId ? { ...access, ...updates } : access
        ),
      })),
      
      removeAllowedSystem: (systemId) => set((state) => ({
        allowedSystems: state.allowedSystems.filter(
          (access) => access.systemId !== systemId
        ),
      })),
      
      // Check if we can connect to a system
      canConnectToSystem: (systemId) => {
        const state = get();
        
        // If it's our own system, we can always connect
        if (state.ownSystem?.id === systemId) {
          return true;
        }
        
        // Check if we have explicit access
        const systemAccess = state.allowedSystems.find(
          (access) => access.systemId === systemId
        );
        
        if (systemAccess) {
          return systemAccess.accessLevel !== AccessLevel.NONE;
        }
        
        // By default, we can't connect
        return false;
      },
      
      // Get a connected system (including own system)
      getConnectedSystem: (systemId) => {
        const state = get();
        
        // Check if it's our own system
        if (state.ownSystem?.id === systemId) {
          return state.ownSystem;
        }
        
        // Check connected systems
        return state.connectedSystems.find((system) => system.id === systemId) || null;
      },
      
      // Get access level for a system
      getSystemAccessLevel: (systemId) => {
        const state = get();
        
        // If it's our own system, we have full access
        if (state.ownSystem?.id === systemId) {
          return AccessLevel.FULL;
        }
        
        // Check allowed systems
        const systemAccess = state.allowedSystems.find(
          (access) => access.systemId === systemId
        );
        
        if (systemAccess) {
          return systemAccess.accessLevel;
        }
        
        // By default, no access
        return AccessLevel.NONE;
      },
    }),
    {
      name: 'pluralkit-overlay-connections',
    }
  )
);

/**
 * Interface for connections controller
 */
export interface ConnectionsController {
  initialize: () => Promise<void>;
  authenticateOwnSystem: (token: string) => Promise<boolean>;
  disconnectOwnSystem: () => Promise<void>;
  connectToSystem: (systemId: string, connectionType: ConnectionType) => Promise<boolean>;
  disconnectFromSystem: (systemId: string) => Promise<void>;
  refreshSystemConnections: () => Promise<void>;
}

export default useConnectionsStore;