import './index.json'
import './index.wxml'
import './index.scss'

import { TransferBehavior, createComponent } from '@codelet/core'

createComponent({
  behaviors: [TransferBehavior],
  data: {
    arrMenus: [
      {
        icon: 'icon-id-photo',
        name: '证件照',
        desc: '智能识别、一键抠图、背景替换、高效制作、轻松便捷',
        url: '/pages/id-photo/index',
      },
      {
        icon: 'icon-compress',
        name: '图片压缩',
        desc: '高效压缩、节省空间、保持清晰，让图片处理更轻松',
      },
      {
        icon: 'icon-crop',
        name: '图片裁剪',
        desc: '一键快速裁剪，精准调整尺寸，轻松打造理想图片效果',
      },
      {
        icon: 'icon-magic',
        name: '在线抠图',
        desc: '智能识别轮廓，一键精准抠图，轻松美化图片，让创意无限释放',
      },
    ],
  },
})
