import './index.json'
import './index.wxml'
import './index.scss'

import { TransferBehavior, createComponent } from '@codelet/core'

createComponent({
  behaviors: [TransferBehavior],
  data: {
    arrMenus: [
      { icon: 'icon-id-photo', name: '证件照', url: '/pages/id-photo/index' },
      { icon: 'icon-compress', name: '图片压缩' },
      { icon: 'icon-crop', name: '图片裁剪' },
      { icon: 'icon-magic', name: '在线抠图' },
    ],
  },
})
