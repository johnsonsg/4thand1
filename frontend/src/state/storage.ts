export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export const memoryStorage: StorageLike = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export function getBrowserStorage(): StorageLike {
  if (typeof window === 'undefined') return memoryStorage;
  return window.localStorage;
}
