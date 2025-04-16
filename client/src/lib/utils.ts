import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names or conditional class names with Tailwind CSS.
 * Uses clsx for conditionals and twMerge to handle Tailwind CSS class conflicts.
 * 
 * @param inputs - Class names to be combined
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Formats a date string to a localized format
 * 
 * @param dateString - Date string to format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Creates a random ID string with a specified length
 * 
 * @param length - Length of the ID
 * @returns Random ID string
 */
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Helper to determine if the current environment is in development mode
 * 
 * @returns Boolean indicating if in development mode
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * Truncates a string to a maximum length, adding an ellipsis if truncated
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength = 100): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
