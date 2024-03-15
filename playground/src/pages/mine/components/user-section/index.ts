import './index.json'
import './index.wxml'
import './index.scss'

import { TransferBehavior, createComponent } from '@codelet/core'

createComponent({
  behaviors: [TransferBehavior],
  properties: {
    userinfo: {
      type: Object,
      value: null as any,
    },
  },
})
