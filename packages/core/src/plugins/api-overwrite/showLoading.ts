import { isString } from '@daysnap/utils'
import { promisify } from '../../utils'

export function showLoading(options: string | Parameters<typeof wx.showLoading>[0] = '') {
  if (isString(options)) {
    options = { title: options, mask: true }
  }
  return promisify(wx.showLoading)(options)
}

declare module '../../bee' {
  interface Bee {
    showLoading: typeof showLoading
  }
}

promisify(wx.showLoading)({
  title: '1',
  success: () => {
    //
  },
}).then(() => {
  //
})
// .then()
