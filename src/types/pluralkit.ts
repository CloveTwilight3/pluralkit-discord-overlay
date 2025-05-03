/**
 * Basic system information
 */
export interface SystemInfo {
  id: string;
  name: string;
  description?: string;
  tag?: string;
  pronouns?: string;
  avatar_url?: string;
  banner?: string;
  color?: string;
  created: string;
  privacy?: SystemPrivacy;
}

/**
 * System privacy settings
 */
export interface SystemPrivacy {
  description_privacy: PrivacyLevel;
  member_list_privacy: PrivacyLevel;
  group_list_privacy: PrivacyLevel;
  front_privacy: PrivacyLevel;
  front_history_privacy: PrivacyLevel;
}

/**
 * Complete privacy settings including allowed viewers
 */
export interface PrivacySettings extends SystemPrivacy {
  allowed_viewers: string[]; // Discord user IDs
}

/**
 * Privacy level for system information
 */
export type PrivacyLevel = 'public' | 'private' | 'public_with_blacklist' | 'private_with_whitelist';

/**
 * System member information
 */
export interface Member {
  id: string;
  name: string;
  display_name?: string;
  color?: string;
  birthday?: string;
  pronouns?: string;
  avatar_url?: string;
  banner?: string;
  description?: string;
  created: string;
  privacy?: MemberPrivacy;
}

/**
 * Member privacy settings
 */
export interface MemberPrivacy {
  visibility: PrivacyLevel;
  name_privacy: PrivacyLevel;
  description_privacy: PrivacyLevel;
  birthday_privacy: PrivacyLevel;
  pronouns_privacy: PrivacyLevel;
  avatar_privacy: PrivacyLevel;
  metadata_privacy: PrivacyLevel;
}

/**
 * Information about a switch
 */
export interface Switch {
  id: string;
  timestamp: string;
  members: Member[];
}

/**
 * Current fronter information response
 */
export interface FronterResponse {
  timestamp: string;
  members: Member[];
  private?: boolean; // Added for privacy handling
}

/**
 * Connection type to a system
 */
export enum ConnectionType {
  AUTOMATIC = 'automatic', // System gave access automatically
  MANUAL = 'manual',      // Manually added by system ID
}

/**
 * Local storage of a connected system
 */
export interface ConnectedSystem {
  id: string;
  name: string;
  connectionType: ConnectionType;
  lastUpdated: string;    // When this connection was last updated
  token?: string;         // Only present for the user's own system
}

/**
 * Fronter display in the overlay
 */
export interface FronterDisplay {
  systemId: string;
  systemName: string;
  members: Member[];
  timestamp: string;
  discordUserId: string;  // Associated Discord user ID
}

/**
 * Error response from PluralKit API
 */
export interface PKError {
  code: number;
  message: string;
  details?: string;
}

/**
 * Authentication result from PluralKit
 */
export interface AuthResult {
  success: boolean;
  system?: SystemInfo;
  error?: string;
}

/**
 * Front history entry
 */
export interface FrontHistoryEntry {
  timestamp: string;
  members: Member[];
  discordUserId: string;
  systemId: string;
  systemName: string;
}

/**
 * Access level for a system to this client
 */
export enum AccessLevel {
  NONE = 'none',           // No access
  READ_ONLY = 'read_only', // Can view fronting info only
  FULL = 'full'            // Can view all system info
}

/**
 * System access configuration
 */
export interface SystemAccess {
  systemId: string;
  accessLevel: AccessLevel;
  allowAutoConnect: boolean;
}