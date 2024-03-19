import './index.json'
import './index.wxml'
import './index.scss'

import { createComponent, ModelBehavior } from '@codelet/core'

createComponent({
  behaviors: [ModelBehavior],
  properties: {
    keyword: {
      type: String,
      value: '',
    },
  },
  methods: {
    handleSearch() {
      this.triggerEvent('search', { keyword: this.data.keyword })
    },
  },
})
