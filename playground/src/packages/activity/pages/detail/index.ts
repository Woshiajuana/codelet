import './index.json'
import './index.wxml'
import './index.scss'

import { createPage, parseQuery } from '@codelet/core'
import { getTitle } from '@/packages/activity/utils'

createPage({
  onLoad(options) {
    const query = parseQuery(options)
    console.log('query => ', query, getTitle('1', '2', '3'))
  },
})
