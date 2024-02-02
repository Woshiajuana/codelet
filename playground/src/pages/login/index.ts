import './index.json'
import './index.wxml'
import './index.scss'

import { createPage } from '@bee/core'

createPage({
  behaviors: [],
  data: {
    title: 'Hello, World!',
  },
  onLoad(query) {
    console.log('login onLoad', query)
    console.log('login data', this.data.title)
  },
})
