export const setStorageItem = <T>(key: string, value: T) => {
  try {
    const json = JSON.stringify(value);

    localStorage.setItem(key, json);
  } catch (err) {
    console.error(`Error setting localStorage[${key}]:`, err);
  }
};

export const getStorageItem = <T>(key: string) => {
  try {
    const value = localStorage.getItem(key);

    return value ? (JSON.parse(value) as T) : null;
  } catch (err) {
    console.error(`Error getting localStorage[${key}]:`, err);
    return null;
  }
};

export const removeStorageItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing localStorage[${key}]:`, err);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
};
