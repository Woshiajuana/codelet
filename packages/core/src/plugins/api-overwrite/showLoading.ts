import { isString } from '@daysnap/utils'
import { promisify } from '../../utils'

export type ShowLoadingPlusOptions = {
  title: string
  mask?: boolean
}

export function showLoading(options: string | ShowLoadingPlusOptions) {
  if (isString(options)) {
    options = { title: options }
  }
  return promisify(wx.showLoading)(options)
}

type OverwriteType = {
  showLoading: typeof showLoading
  showLoading1: typeof showLoading
}

declare module '../../bee' {
  interface Bee extends OverwriteType {}
}