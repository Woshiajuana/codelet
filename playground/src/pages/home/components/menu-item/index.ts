import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent } from '@codelet/core'

createComponent({
  properties: {
    item: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
    },
  },
})
