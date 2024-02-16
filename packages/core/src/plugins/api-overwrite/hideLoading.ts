import { promisify } from '../../utils'

export function hideLoading(options: Parameters<typeof wx.hideLoading>[0]) {
  return promisify(wx.hideLoading)({}, 1)
}

wx.showLoading()
wx.hideLoading()
