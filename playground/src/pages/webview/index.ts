import './index.json'
import './index.wxml'
import './index.scss'

import { RouterBehavior, createPage } from '@codelet/core'

createPage({
  behaviors: [RouterBehavior],
  onLoad(query) {
    this.routerParseQuery(query)
  },
  handleMessage(event: any) {
    //
  },
})
