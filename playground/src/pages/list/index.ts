import './index.json'
import './index.wxml'
import './index.scss'

import bee, { PagingBehavior, createPage } from '@bee/core'
import { sleep } from '@daysnap/utils'

createPage({
  behaviors: [PagingBehavior],
  data: {
    title: 'Hello, World!',
  },
  onLoad(query) {
    // this.pagingDefineConfig(async () => {
    //   // /// ///
    //   // xxx
    //   //
    // })
    // //
    this.pagingRefresh()
    console.log('home onLoad', query)
    console.log('home data', this.data.title)
    Promise.resolve().toast()
  },
  handleTap(...event: any) {
    // this.pagingDefineConfig()
    console.log('event => ', event)
  },
  async pagingFetchData(pageIndex: number, loading: boolean) {
    console.log('pageIndex => ', pageIndex)
    console.log('loading => ', loading)
    await sleep(1000)
    return [10, 20]
  },
})
