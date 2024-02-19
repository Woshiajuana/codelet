import './index.json'
import './index.wxml'
import './index.scss'

import { RouterBehavior, createPage } from '@bee/core'

createPage({
  behaviors: [RouterBehavior],
  data: {
    title: 'Hello, World!',
  },
  onLoad(query) {
    this.routerParseQuery(query)
    this.options
    console.log('login onLoad', this.data.query)
  },
})
