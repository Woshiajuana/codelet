import './index.json'
import './index.wxml'
import './index.scss'

import { createPage } from '@codelet/core'
import { sleep } from '@daysnap/utils'

import { withError, withLoading } from '@/utils'

async function reqDataList(x: number) {
  console.log('x => ', x)
  await sleep(1000)
  if (x) {
    throw x
  }
  return [1, 2, 3]
}

const reqDataListLoading = withLoading(reqDataList)

console.log('reqDataList', reqDataList.length)
console.log('reqDataListLoading', reqDataListLoading.length)

const reqDataListLoadingError = withError(reqDataListLoading)

createPage({
  async fetchData() {
    const data = await reqDataListLoadingError(1, 'true', this)
    this.setData({ data })
  },
})
