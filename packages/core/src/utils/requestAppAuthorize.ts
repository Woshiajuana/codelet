import { col } from '../codelet'

// 'authorized' 表示已经获得授权，无需再次请求授权； 'denied' 表示请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限） 'non determined' 表示尚未请求授权，会在微信下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
export async function requestAppAuthorize(options: {
  key: keyof WechatMiniprogram.AppAuthorizeSetting
  message?: string
}) {
  const { key, message } = options

  let flag = false
  const request = async () => {
    const setting = col.getAppAuthorizeSetting()
    const permission = setting[key]

    if (permission === 'denied') {
      if (flag) {
        throw message || '进行此操作，需要授权'
      }
      const res = await col.showModal({
        title: '授权提示',
        content: message,
        confirmText: '去授权',
      })

      if (res.confirm) {
        await col.openAppAuthorizeSetting()

        flag = true
        await request()
      } else {
        throw 'app authorize fail: cancel'
      }
    }
  }

  await request()
}
