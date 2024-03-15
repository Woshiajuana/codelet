import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent } from '@codelet/core'

createComponent({
  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
  },
})
