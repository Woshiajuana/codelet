export const getSystemInfo = (() => {
  let systemInfo: WechatMiniprogram.SystemInfo
  return () => {
    if (!systemInfo) {
      systemInfo = wx.getSystemInfoSync()
    }
    return systemInfo
  }
})()

export const j = (value: number) => {
  const { windowWidth } = getSystemInfo()
  return value * (windowWidth / 750)
}

export const getAccountInfo = (() => {
  let accountInfo: WechatMiniprogram.AccountInfo
  return () => {
    if (!accountInfo) {
      accountInfo = wx.getAccountInfoSync()
    }
    return accountInfo
  }
})()

export const isProd = (() => {
  let result = true
  try {
    const accountInfo = getAccountInfo()
    const { envVersion } = accountInfo.miniProgram
    // develop trial release
    if (['develop', 'trial'].includes(envVersion)) {
      result = false
    }
  } catch (e) {
    /* empty */
  }
  return result
})()
