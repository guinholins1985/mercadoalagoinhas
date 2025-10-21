// A simple utility wrapper for localStorage to handle JSON serialization and parsing.

export const storage = {
  /**
   * Retrieves an item from localStorage and parses it as JSON.
   * @param key The key of the item to retrieve.
   * @param defaultValue A default value to return if the key doesn't exist or parsing fails.
   * @returns The parsed value or the default value.
   */
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue) as T;
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
    }
    return defaultValue;
  },

  /**
   * Serializes a value to JSON and stores it in localStorage.
   * @param key The key under which to store the value.
   * @param value The value to store.
   */
  setItem: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    // FIX: Added curly braces to the catch block to correctly scope the error variable and fix the syntax error.
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  },
};