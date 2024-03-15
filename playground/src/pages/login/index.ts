import './index.json'
import './index.wxml'
import './index.scss'

import col, { createPage } from '@codelet/core'
import { userinfoStorage } from '@/utils'

createPage({
  handleSubmit() {
    userinfoStorage.setItem({ token: '123', nickname: '我是阿倦啊' })
    col.navigateBack()
  },
})
