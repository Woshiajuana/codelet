import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent } from '@codelet/core'

createComponent({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
})
