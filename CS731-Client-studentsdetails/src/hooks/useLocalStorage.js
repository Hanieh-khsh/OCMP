import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Attempt to retrieve and parse the stored value
      const item = localStorage.getItem(key);
      // If the item is found, try to parse it, otherwise return the initial value
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”`, error);
      return initialValue; // Return initial value if parsing fails
    }
  });

  const setValue = (value) => {
    try {
      // Store the value in state
      setStoredValue(value);
      // Convert the value to a JSON string and store it in localStorage
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
