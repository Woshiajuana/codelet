import './index.json'
import './index.wxml'
import './index.scss'

import { createPage, parseQuery } from '@codelet/core'

createPage({
  onLoad(options) {
    const query = parseQuery(options)
    console.log('query => ', query)
  },
})
