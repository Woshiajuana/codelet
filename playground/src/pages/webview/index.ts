import './index.json'
import './index.wxml'
import './index.scss'

import { formatPathParams } from '@daysnap/utils'
import col, {
  createPage,
  getPageByPosition,
  parseEvent,
  type Event,
  parseQuery,
} from '@codelet/core'
import { userinfoStorage } from '@/utils'

createPage({
  onLoad(options) {
    const { label, title, link } = parseQuery(options)
    col.setNavigationBarTitle({ title: title || label })
    const userinfo = userinfoStorage.getItem()
    const params = Object.assign({ t: Date.now() }, userinfo)
    const { path: url } = formatPathParams(link, params)
    this.setData({ url })
  },
  handleMessage(event: Event) {
    const { handle } = this.data.query
    if (!handle) return
    const { data } = parseEvent(event)
    const page = getPageByPosition(-1)
    page?.[handle]?.(data)
  },
})
