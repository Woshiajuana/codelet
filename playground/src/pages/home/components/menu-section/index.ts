import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent } from '@codelet/core'

createComponent({
  data: {
    arrMenus: [
      { icon: 'icon-id-photo', name: '证件照' },
      { icon: 'icon-compress', name: '图片压缩' },
      { icon: 'icon-crop', name: '图片裁剪' },
      { icon: 'icon-magic', name: '在线抠图' },
    ],
  },
})
