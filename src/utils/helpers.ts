/**
 * Helper functions for the application
 */

/**
 * Format a date as a relative time string (e.g., "5 minutes ago")
 * @param date The date to format
 * @returns Formatted string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  // Invalid date
  if (isNaN(then.getTime())) {
    return 'Invalid date';
  }
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  // Format as date
  return then.toLocaleDateString();
};

/**
 * Generate a user-friendly color from a string (e.g., for systems without a color)
 * @param str String to generate color from
 * @returns Hex color code
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Ensure the color is not too dark
  const hue = hash % 360;
  const saturation = 70 + (hash % 30); // 70-100%
  const lightness = 45 + (hash % 20); // 45-65%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Truncate a string to a maximum length with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Debounce a function call
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create a throttled function
 * @param func Function to throttle
 * @param limit Limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Check if a value is a valid PluralKit system ID
 * @param value Value to check
 * @returns Whether the value is a valid system ID
 */
export const isValidSystemId = (value: string): boolean => {
  // PluralKit system IDs are 5 character alphanumeric strings
  return /^[a-z]{5}$/.test(value);
};

/**
 * Generate a random ID for internal use
 * @returns Random ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};