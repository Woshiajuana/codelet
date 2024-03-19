import './index.json'
import './index.wxml'
import './index.scss'

import col, {
  createPage,
  type Event,
  getPageByPosition,
  parseEvent,
  parseQuery,
} from '@codelet/core'
import { formatPathParams } from '@daysnap/utils'

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
