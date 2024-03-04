import type { Loose } from '@daysnap/types'

// 这里只是简单用于合并behaviors 内部使用
// 外部不要使用
export function mergeBehavior(
  target: Loose<{
    behaviors?: any[]
  }> = {},
  behaviors: any[] = [],
): any {
  if (!target.behaviors) {
    target.behaviors = []
  }
  target.behaviors.unshift(...behaviors)
  return target
}
