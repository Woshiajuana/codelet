import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent } from '@codelet/core'

createComponent({
  properties: {
    label: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    icon: {
      type: String,
      value: '',
    },
    arrow: {
      type: Boolean,
      value: false,
    },
  },
})
