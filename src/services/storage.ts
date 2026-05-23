export const STORAGE_VERSION = '1.0.0';
export const STORAGE_KEY = 'premium-duck-data';

export interface StorageSchema {
  version: string;
}

export const initStorage = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
    }));
  }
};
