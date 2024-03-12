import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent } from '@codelet/core'
import { TransferBehavior } from '@/behaviors'

createComponent({
  behaviors: [TransferBehavior],
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
})
