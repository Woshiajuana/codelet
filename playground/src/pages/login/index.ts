import './index.json'
import './index.wxml'
import './index.scss'

import col, { createPage } from '@codelet/core'
import { userinfoStorage } from '@/utils'
import { sleep } from '@daysnap/utils'

createPage({
  async handleSubmit() {
    userinfoStorage.setItem({ token: '123', nickname: '我是阿倦啊' })
    col.showToast({ title: '登录成功' })
    await sleep(1000)
    col.navigateBack()
  },
})
