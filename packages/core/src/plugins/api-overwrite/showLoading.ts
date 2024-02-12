import { isString } from '@daysnap/utils'
import { promisify } from '../../utils'

export type ShowLoadingPlusOptions = {
  title: string
  mask?: boolean
}

export function showLoadingPlus(options: string | ShowLoadingPlusOptions) {
  if (isString(options)) {
    options = { title: options }
  }
  return promisify(wx.showLoading)(options)
}
