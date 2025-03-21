import type { Loose } from '@daysnap/types'
import { isBoolean, isFunction, isObject } from '@daysnap/utils'

import { createBehavior } from '../create/createBehavior'
import { parseEvent } from '../utils'

export const PagingBehavior = createBehavior({
  data: {
    pagingIndex: 1,
    pagingSize: 10,
    pagingTotal: -1,
    pagingData: [] as any[], // 二维数组
    pagingIsLoading: false,
    pagingNumTotal: -1, // 加载的 total
  },
  methods: {
    /**
     * 刷新
     */
    async pagingRefresh(event: any = {}) {
      const { loading, callback, ...rest } = isObject(event)
        ? parseEvent(event as any)
        : {
            loading: isBoolean(event) ? event : false,
            callback: isFunction(event) ? event : null,
          }
      await this.pagingTrigger(1, { ...rest, loading, callback })
    },

    /**
     * 请求数据
     */
    async pagingTrigger(pagingIndex: number, options: PagingOptions = {}) {
      try {
        // eslint-disable-next-line prefer-const
        let { pagingSize } = this.data
        const [list, pagingTotal] = await this.pagingFetchData([pagingIndex, pagingSize], options)
        await this.pagingProcessingData([pagingIndex, pagingSize], [list, pagingTotal], options)
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error
      } finally {
        if (options.callback) {
          options.callback()
        }
        this.setData({ pagingIsLoading: false })
      }
    },

    /**
     * 处理数据
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async pagingProcessingData(params: PagingParams, result: PagingResult, _: PagingOptions = {}) {
      const [pagingIndex] = params
      let { pagingData, pagingNumTotal } = this.data
      const [list, pagingTotal] = result
      if (pagingIndex === 1) {
        pagingData = []
        pagingNumTotal = 0
        pagingNumTotal += list.length
        pagingData[0] = list
        this.setData({
          pagingNumTotal,
          pagingTotal,
          pagingData,
          pagingIndex,
        })
      } else {
        pagingNumTotal += list.length
        this.setData({
          pagingNumTotal,
          pagingTotal,
          pagingIndex,
          [`pagingData[${pagingIndex - 1}]`]: list,
        })
      }
    },

    /**
     * 加载
     */
    async pagingLoad(options?: any) {
      const { pagingTotal, pagingData, pagingNumTotal, pagingIsLoading, pagingIndex } = this.data
      if (pagingIsLoading) {
        return console.log('正在加载中...')
      }
      if (pagingData && pagingTotal <= pagingNumTotal) {
        return console.log('没有更多了...')
      }
      await this.pagingTrigger(pagingIndex + 1, options)
    },

    /**
     * 请求配置方法
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async pagingFetchData(_: PagingParams, __?: any): Promise<PagingResult<any>> {
      // 请在页面中实现
      throw new Error('pagingFetchData is not defined')
    },

    /**
     * 根据查询条件找到 index，pagingData 是一个二维数组，返回的结果是一个数组的 index
     * 如果没找到会返回成 [-1, -1]
     */
    pagingFindIndexBy(query: Record<string, any>) {
      const { pagingData } = this.data
      let twoIndex = -1
      const oneIndex = pagingData.findIndex((data: Record<string, any>[]) => {
        const index = data.findIndex((item) => {
          return !Object.keys(query).find((key) => item[key] !== query[key])
        })
        if (index > -1) twoIndex = index
        return index > -1
      })
      return [oneIndex, twoIndex]
    },
  },
})

export type PagingParams = [number, number]

export type PagingResult<T = any> = [T[], number]

export type PagingOptions = Loose<{
  loading?: boolean
  callback?: (...args: any) => any
}>
