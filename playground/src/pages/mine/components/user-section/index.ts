import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent, TransferBehavior } from '@codelet/core'

createComponent({
  behaviors: [TransferBehavior],
  properties: {
    userinfo: {
      type: Object,
      value: null as any,
    },
  },
})
