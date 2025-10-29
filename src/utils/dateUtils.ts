/**
 * Date formatting utilities
 * All dates in the application should be formatted as MM/DD/YYYY
 */

/**
 * Formats a date to MM/DD/YYYY format
 * @param dateInput - Date string (ISO format YYYY-MM-DD) or Date object
 * @returns Formatted date string in MM/DD/YYYY format, or empty string if invalid
 */
export const formatDateMMDDYYYY = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  
  try {
    const date = typeof dateInput === 'string' 
      ? new Date(dateInput.includes('T') ? dateInput : dateInput + 'T00:00:00')
      : new Date(dateInput);
    
    if (isNaN(date.getTime())) return '';
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch {
    return '';
  }
};

/**
 * Formats a date for display (alias for formatDateMMDDYYYY for consistency)
 * This replaces the old formatDate function that used different formats
 */
export const formatDate = formatDateMMDDYYYY;

