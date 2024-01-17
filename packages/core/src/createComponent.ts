import type { ComponentOptions } from './types'

export function createComponent(options: ComponentOptions = {}) {
  return Component(options)
}
