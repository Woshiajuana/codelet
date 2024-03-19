import './index.json'
import './index.wxml'
import './index.scss'

import { createPage } from '@codelet/core'

import { UserinfoBehavior } from '@/behaviors'

createPage({
  behaviors: [UserinfoBehavior],
  onShow() {
    this.userinfoGet()
  },
})
