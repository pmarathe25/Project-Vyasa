import * as React from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (typeof localStorage.getItem(key) === 'undefined') {
    localStorage.setItem(key, JSON.stringify(defaultValue));
  }

  const [value, setValue] = React.useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  });

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}