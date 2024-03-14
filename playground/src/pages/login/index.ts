import './index.json'
import './index.wxml'
import './index.scss'

import { createPage } from '@codelet/core'

createPage({
  onLoad(query) {
    console.log('query22212 122222221> ', query)
  },
  handleTap(e: any) {
    console.log('handleTap12 122211=>', e)
  },
})
