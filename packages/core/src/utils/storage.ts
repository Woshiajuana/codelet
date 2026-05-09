import { isArray, isObject } from '@daysnap/utils'
import { col } from '../codelet'

export class Storage<T = any> {
  private readonly key: string
  private value: T | null = null

  constructor(key: string, initialValue?: T) {
    this.key = key

    if (initialValue) {
      this.setItem(initialValue)
    }
  }

  /**
   * 设置值
   */
  setItem(val: T) {
    col.setStorageSync(this.key, val)
    this.value = this.getItem()
    return val
  }

  /**
   * 获取值
   */
  getItem(): T | null
  getItem(defaultVal: Partial<T>): T
  getItem(defaultVal?: any): any {
    const val = col.getStorageSync(this.key) ?? null
    if (val === null) {
      return defaultVal ?? null
    }
    return val
  }

  /**
   * 删除值
   */
  removeItem() {
    this.value = null
    col.removeStorageSync(this.key)
  }

  /**
   * 更新值
   */
  updateItem(val: Partial<T>) {
    this.value = null

    const oldVal = this.getItem()
    if (isArray(val) && isArray(oldVal)) {
      val = [...oldVal, ...val] as any
    } else if (isObject(val) && isObject(oldVal)) {
      val = { ...oldVal, ...val }
    }

    return this.setItem(val as T)
  }

  /**
   * 获取值后，删除存储的值
   */
  getItemOnce(): T | null
  getItemOnce(defaultVal: Partial<T>): T
  getItemOnce(defaultVal?: any): any {
    const val = this.getItem(defaultVal)

    this.removeItem()

    return val
  }

  /**
   * 优先从缓存中获取值
   */
  getItemWithCache(): T | null
  getItemWithCache(defaultVal: Partial<T>): T
  getItemWithCache(defaultVal?: any): any {
    if (this.value !== null) {
      return this.value
    }
    const val = this.getItem()
    if (val === null) {
      return defaultVal ?? null
    }
    this.value = val
    return this.value
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.value = null
  }
}
