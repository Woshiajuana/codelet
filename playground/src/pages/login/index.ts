import './index.json'
import './index.wxml'
import './index.scss'

import col, { createPage } from '@codelet/core'
import { sleep } from '@daysnap/utils'

import { userinfoStorage, withLoading } from '@/utils'

createPage({
  async handleSubmit() {
    await withLoading(async () => {
      await sleep(1000)
      userinfoStorage.setItem({ token: '123', nickname: '我是阿倦啊' })
    })()
    col.showToast({ title: '登录成功' })
    await sleep(1000)
    col.navigateBack()
  },
})
