import './index.json'
import './index.wxml'
import './index.scss'

import bee, { createPage } from '@bee/core'

createPage({
  behaviors: [],
  data: {
    title: 'Hello, World!',
  },
  onLoad(query) {
    console.log('home onLoad', query)
    console.log('home data', this.data.title)
    Promise.resolve().toast()
  },
  handleTap(...event: any) {
    console.log('event => ', event)
  },
})
