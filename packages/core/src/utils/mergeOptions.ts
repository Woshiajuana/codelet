import { isArray, isObject } from '@daysnap/utils'

// 内部使用 因此类型不做严格校验
// 合并 target 和 source 对象 只对第一层进行类型判断合并
// 合并一些初始化的属性 不是深度合并
export function mergeOptions(target: any = {}, source: any = {}) {
  Object.entries(source).forEach(([key, value]) => {
    if (isObject(value)) {
      if (isObject(target[key])) {
        target[key] = { ...target[key], ...value }
      } else {
        target[key] = value
      }
    } else if (isArray(value)) {
      if (isArray(target[key])) {
        target[key] = [...target[key], ...value]
      } else {
        target[key] = value
      }
    } else {
      target[key] = value
    }
  })

  return target
}
