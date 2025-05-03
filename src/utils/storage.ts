/**
 * Storage utilities for handling local storage
 */

// Storage keys
export const STORAGE_KEYS = {
  OVERLAY_SETTINGS: 'pluralkit-overlay-settings',
  CONNECTIONS: 'pluralkit-overlay-connections',
  SYSTEM_TOKEN: 'pluralkit-system-token', // Sensitive, encrypted
};

/**
 * Get an item from localStorage with error handling
 * @param key Storage key
 * @param defaultValue Default value if not found
 * @returns Parsed value or default
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage with error handling
 * @param key Storage key
 * @param value Value to store
 * @returns Success status
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove an item from localStorage with error handling
 * @param key Storage key
 * @returns Success status
 */
export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage related to this app
 * @returns Success status
 */
export const clearStorage = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Simple encryption for sensitive data (not truly secure, but better than plaintext)
 * @param data Data to encrypt
 * @returns Encrypted data
 */
export const encryptData = (data: string): string => {
  // This is a very basic encryption, not meant for true security
  // Just to avoid having tokens stored in plain text
  const encoded = btoa(
    encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return encoded.split('').reverse().join('');
};

/**
 * Decrypt data encrypted with encryptData
 * @param encrypted Encrypted data
 * @returns Decrypted data
 */
export const decryptData = (encrypted: string): string => {
  try {
    const reversed = encrypted.split('').reverse().join('');
    return decodeURIComponent(
      atob(reversed)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return '';
  }
};

/**
 * Store sensitive data with basic encryption
 * @param key Storage key
 * @param value Value to store
 * @returns Success status
 */
export const setSecureStorageItem = (key: string, value: string): boolean => {
  try {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
    return true;
  } catch (error) {
    console.error(`Error storing ${key} securely:`, error);
    return false;
  }
};

/**
 * Get sensitive data with basic decryption
 * @param key Storage key
 * @returns Decrypted value or empty string
 */
export const getSecureStorageItem = (key: string): string => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return '';
    return decryptData(encrypted);
  } catch (error) {
    console.error(`Error retrieving ${key} securely:`, error);
    return '';
  }
};