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
    console.log('home onLoad', query)
    console.log('home data', this.data.title)
  },
})
