
import { useState, useEffect } from 'react';

// This function safely merges a potentially incomplete data object with a default structure.
// It ensures that all properties from the default object exist on the final object,
// especially the nested 'settings' object.
const safeMerge = <T extends object>(defaultData: T, loadedData: Partial<T>): T => {
  const mergedData = { ...defaultData, ...loadedData };
  
  // Ensure the 'settings' object is also merged to prevent it from being undefined.
  if ('settings' in defaultData) {
    (mergedData as any).settings = {
      ...(defaultData as any).settings,
      ...((loadedData as any)?.settings || {}),
    };
  }

  return mergedData;
};

function useLocalStorage<T extends object>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        return safeMerge(initialValue, parsedItem);
      }
      return initialValue;
    } catch (error) {
      console.error("Error reading from local storage on init:", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToProcess = value instanceof Function ? value(storedValue) : value;
      const valueToStore = safeMerge(initialValue, valueToProcess);
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to local storage:", error);
    }
  };

  useEffect(() => {
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            const parsedItem = JSON.parse(item);
            setStoredValue(safeMerge(initialValue, parsedItem));
        }
    } catch (e) {
        console.error("Error reading from local storage in effect:", e);
    }
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
