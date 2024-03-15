import { col } from '../codelet'

function setItem<T = any>(key: string, val: T) {
  col.setStorageSync<T>(key, val)
  return val
}

function getItem<T = any>(key: string, defaultVal: Partial<T> | null = null) {
  return col.getStorageSync<T>(key) || defaultVal
}

function removeItem(key: string) {
  col.removeStorageSync(key)
}

function updateItem<T = any>(key: string, val: Partial<T>) {
  const prev = getItem<T>(key) || {}
  return setItem<T>(key, { ...prev, ...val } as T)
}

export function createStorage<T = any>(key: string) {
  return {
    setItem: (val: T) => setItem<T>(key, val),
    getItem: (defaultVal?: Partial<T>) => getItem<T>(key, defaultVal),
    removeItem: () => removeItem(key),
    updateItem: (val: Partial<T>) => updateItem<T>(key, val),
  }
}
