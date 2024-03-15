import { col } from '../codelet'

/**
 * 申请授权操作
 */
export async function requestAuthorize(options: { scope: string; message?: string }) {
  const { scope, message } = options
  await col.authorize({
    scope,
  })
  if (!message) {
    throw new Error('进行此操作，需要授权')
  }

  await col.showModal({
    title: '授权提示',
    content: message,
  })

  const { authSetting } = await col.openSetting()
  if (!(authSetting as any)[scope]) {
    throw new Error('进行此操作，需要授权')
  }
}
