import col from '@codelet/core'
import { formatMessage, isString } from '@daysnap/utils'

import { __DEV__ } from './constant'
import { excludeMessage } from './excludeMessage'

export function handleError(err: any) {
  if (isString(err) && err.includes('MiniProgramError')) {
    const res = err.match(/MiniProgramError\n(.*?)\n/)
    // const res = err.match(/"(.*?)"/)
    if (res) err = res[1]
  }
  const message = formatMessage(err?.reason ?? err)
  if (message && !excludeMessage(message)) {
    col.showToast({ title: message, icon: 'none' })
  }

  // development env 需要抛出异常 方便查看问题
  if (__DEV__) {
    console.error(err)
  }
}
