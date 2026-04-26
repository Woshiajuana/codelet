import './index.json'
import './index.wxml'
import './index.scss'

import { createPage, parseQuery } from '@codelet/core'
import { getTitle } from '@/packages/user/utils'
import { getMainTitle } from '@/utils'

createPage({
  onLoad(options) {
    const query = parseQuery(options)
    console.log('query => ', query, getMainTitle('1', '2', '3') + getTitle('1', '2', '3'))
  },
})
