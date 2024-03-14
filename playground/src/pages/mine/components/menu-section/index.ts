import './index.json'
import './index.wxml'
import './index.scss'

import { TransferBehavior, createComponent } from '@codelet/core'

createComponent({
  behaviors: [TransferBehavior],
  data: {
    arrMenus: [
      {
        label: '使用帮助',
        icon: 'icon-question-o',
        isArrow: true,
        url: '/pages/webview/index',
        link: 'https://ajuan.daysnap.cn/',
        // query: { url: 'https://ajuan.daysnap.cn/', title: '使用帮助' },
      },
      {
        label: '反馈与建议',
        icon: 'icon-newspaper-o',
        isArrow: true,
        url: '/pages/webview/index',
        query: { url: 'https://ajuan.daysnap.cn/', title: '反馈与建议' },
      },
      {
        label: '关于我们',
        icon: 'icon-info-o',
        isArrow: true,
        url: '/pages/webview/index',
        query: { url: 'https://ajuan.daysnap.cn/', title: '关于我们' },
      },
    ],
  },
})
