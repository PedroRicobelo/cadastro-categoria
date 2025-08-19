import { useState, useCallback } from "react";

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return defaultValue;
    } catch (error) {
      console.warn(`Erro ao carregar ${key} do localStorage:`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.warn(`Erro ao salvar ${key} no localStorage:`, error);
        setValue(newValue);
      }
    },
    [key]
  );

  return [value, setStoredValue];
}
