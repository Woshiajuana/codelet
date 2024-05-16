import { isArray, isObject } from '@daysnap/utils'

import { col } from '../codelet'

type DefaultVal<T> = T extends Record<string, any> ? Partial<T> : T

function setItem<T = any>(key: string, val: T) {
  col.setStorageSync<T>(key, val)
  return val
}

function getItem<T = any>(key: string): T | undefined
function getItem<T = any>(key: string, defaultVal: DefaultVal<T>): T
function getItem<T = any>(key: string, defaultVal?: any) {
  return col.getStorageSync<T>(key) || defaultVal
}

function removeItem(key: string) {
  col.removeStorageSync(key)
}

function updateItem<T = any>(key: string, val: DefaultVal<T>) {
  const prev = getItem<T>(key)
  if (isObject(val)) {
    val = { ...(prev ?? {}), ...val }
  } else if (isArray(val)) {
    val = [...((prev as any[]) ?? []), ...val] as any
  }
  return setItem<T>(key, val as T)
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
  getItem(defaultVal: DefaultVal<T>): T
  removeItem(): void
  updateItem(val: DefaultVal<T>): T
}
