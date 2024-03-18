import { col } from '../codelet'

function setItem<T = any>(key: string, val: T) {
  col.setStorageSync<T>(key, val)
  return val
}

function getItem<T = any>(key: string): T | undefined
function getItem<T = any>(key: string, defaultVal: Partial<T>): T
function getItem<T = any>(key: string, defaultVal?: any) {
  return col.getStorageSync<T>(key) || defaultVal
}

function removeItem(key: string) {
  col.removeStorageSync(key)
}

function updateItem<T = any>(key: string, val: Partial<T>) {
  const prev = getItem<T>(key, {})
  return setItem<T>(key, { ...prev, ...val } as T)
}

export function createStorage<T = any>(key: string) {
  return {
    setItem: (val) => setItem(key, val),
    getItem: (defaultVal) => getItem(key, defaultVal),
    removeItem: () => removeItem(key),
    updateItem: (val) => updateItem(key, val),
  } as StorageInstance<T>
}

export interface StorageInstance<T = any> {
  setItem(val: T): T
  getItem(): T | undefined
  getItem(defaultVal: Partial<T>): T
  removeItem(): void
  updateItem(val: Partial<T>): T
}
