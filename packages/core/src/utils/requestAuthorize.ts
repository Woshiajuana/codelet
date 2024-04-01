import { col } from '../codelet'

/**
 * 申请授权操作
 */
export async function requestAuthorize(options: {
  scope: keyof WechatMiniprogram.AuthSetting
  message?: string
}) {
  const { scope, message } = options

  try {
    await col.authorize({
      scope,
    })
  } catch {
    if (!message) {
      throw '进行此操作，需要授权'
    }
    const res = await col.showModal({
      title: '授权提示',
      content: message,
    })
    if (res.confirm) {
      const { authSetting } = await col.openSetting()
      if (!authSetting[scope]) {
        throw '进行此操作，需要授权'
      }
    }
  }
}
