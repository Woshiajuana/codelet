import './index.json'
import './index.wxml'
import './index.scss'

import { formatPathParams } from '@daysnap/utils'
import col, { RouterBehavior, createPage } from '@codelet/core'

createPage({
  behaviors: [RouterBehavior],
  onLoad(query) {
    this.routerParseQuery(query)
    this.initData()
  },
  initData() {
    const { label, title, link } = this.data.query
    col.setNavigationBarTitle({ title: title || label })
    const { path: url } = formatPathParams(link, {
      t: Date.now(), // 防止缓存
    })
    this.setData({ url })
  },
  handleMessage(event: any) {
    //
  },
})
