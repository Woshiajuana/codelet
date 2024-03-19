import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent, TransferBehavior } from '@codelet/core'

createComponent({
  behaviors: [TransferBehavior],
  data: {
    menus: [
      {
        label: '使用帮助',
        icon: 'icon-question-o',
        arrow: true,
        url: '/pages/webview/index',
        link: 'https://ajuan.daysnap.cn/',
      },
      {
        label: '二维码',
        icon: 'icon-qr',
        arrow: true,
        url: '/pages/webview/index',
        link: 'https://ajuan.daysnap.cn/',
      },
      {
        label: '反馈与建议',
        icon: 'icon-newspaper-o',
        arrow: true,
        url: '/pages/webview/index',
        link: 'https://ajuan.daysnap.cn/',
      },
      {
        label: '关于我们',
        icon: 'icon-info-o',
        arrow: true,
        url: '/pages/webview/index',
        link: 'https://ajuan.daysnap.cn/',
      },
      {
        label: '设置',
        icon: 'icon-setting-o',
        arrow: true,
        url: '/pages/setting/index',
      },
    ],
  },
})
