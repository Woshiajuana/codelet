import type { ComponentOptions } from '../types'

export function createComponent<T extends ComponentOptions>(options: T) {
  return Component(options || {})
}
