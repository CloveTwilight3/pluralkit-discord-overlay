import axios from 'axios';
import { SystemInfo, Member, Switch, FronterResponse, PrivacySettings } from '../types/pluralkit';

// PluralKit API base URL
const API_BASE = 'https://api.pluralkit.me/v2';

// API client with configurable token
const createClient = (token?: string) => {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = token;
  }
  
  return axios.create({
    baseURL: API_BASE,
    headers,
    timeout: 10000,
  });
};

/**
 * Get information about a system using its ID
 * @param systemId The system ID
 * @param token Optional token for private info
 */
export const getSystem = async (systemId: string, token?: string): Promise<SystemInfo> => {
  const client = createClient(token);
  const response = await client.get(`/systems/${systemId}`);
  return response.data;
};

/**
 * Get information about the system associated with the token
 * @param token The system token
 */
export const getSelfSystem = async (token: string): Promise<SystemInfo> => {
  const client = createClient(token);
  const response = await client.get('/systems/@me');
  return response.data;
};

/**
 * Get all members of a system
 * @param systemId The system ID
 * @param token Optional token for private members
 */
export const getSystemMembers = async (systemId: string, token?: string): Promise<Member[]> => {
  const client = createClient(token);
  const response = await client.get(`/systems/${systemId}/members`);
  return response.data;
};

/**
 * Get current fronters for a system
 * @param systemId The system ID
 * @param token Optional token for private fronters
 */
export const getCurrentFronters = async (systemId: string, token?: string): Promise<FronterResponse> => {
  const client = createClient(token);
  try {
    const response = await client.get(`/systems/${systemId}/fronters`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      // Privacy error - fronting info is private
      return {
        timestamp: new Date().toISOString(),
        members: [],
        private: true,
      };
    }
    throw error;
  }
};

/**
 * Get recent switches for a system
 * @param systemId The system ID
 * @param token Optional token for private switches
 * @param limit Maximum number of switches to return
 */
export const getRecentSwitches = async (
  systemId: string, 
  token?: string, 
  limit: number = 10
): Promise<Switch[]> => {
  const client = createClient(token);
  try {
    const response = await client.get(`/systems/${systemId}/switches`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      // Privacy error - switch info is private
      return [];
    }
    throw error;
  }
};

/**
 * Update privacy settings for the system
 * @param token The system token
 * @param settings Privacy settings to update
 */
export const updatePrivacySettings = async (
  token: string,
  settings: Partial<PrivacySettings>
): Promise<PrivacySettings> => {
  const client = createClient(token);
  const response = await client.patch('/systems/@me/privacy', settings);
  return response.data;
};

/**
 * Add a Discord account that can view fronting information
 * @param token The system token
 * @param discordId Discord user ID to grant access
 */
export const addAllowedViewer = async (
  token: string,
  discordId: string
): Promise<string[]> => {
  const client = createClient(token);
  const response = await client.post('/systems/@me/privacy/viewers', {
    discord_id: discordId
  });
  return response.data;
};

/**
 * Remove a Discord account from viewing fronting information
 * @param token The system token
 * @param discordId Discord user ID to remove access
 */
export const removeAllowedViewer = async (
  token: string,
  discordId: string
): Promise<string[]> => {
  const client = createClient(token);
  const response = await client.delete(`/systems/@me/privacy/viewers/${discordId}`);
  return response.data;
};

/**
 * Check if a Discord user has permission to view a system's fronting information
 * @param systemId The system ID
 * @param discordId Discord user ID to check
 * @param token Optional token for authenticated check
 */
export const checkViewerPermission = async (
  systemId: string,
  discordId: string,
  token?: string
): Promise<boolean> => {
  const client = createClient(token);
  try {
    const response = await client.get(`/systems/${systemId}/privacy/viewers/${discordId}`);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

/**
 * Get all Discord users allowed to view fronting information
 * @param token The system token
 */
export const getAllowedViewers = async (token: string): Promise<string[]> => {
  const client = createClient(token);
  const response = await client.get('/systems/@me/privacy/viewers');
  return response.data;
};

// Export all functions as the PluralKit API
export const PluralKitAPI = {
  getSystem,
  getSelfSystem,
  getSystemMembers,
  getCurrentFronters,
  getRecentSwitches,
  updatePrivacySettings,
  addAllowedViewer,
  removeAllowedViewer,
  checkViewerPermission,
  getAllowedViewers,
};

export default PluralKitAPI;