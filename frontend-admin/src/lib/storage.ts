// Helper functions for interacting with localStorage

export const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return null;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const item = JSON.stringify(value);
    window.localStorage.setItem(key, item);
  } catch (error) {
    console.error(`Error saving to localStorage key “${key}”:`, error);
  }
};