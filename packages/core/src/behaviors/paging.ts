import { createBehavior } from '../create'

export const PagingBehavior = createBehavior({
  data: {
    pagingIndex: 1,
    pagingSize: 10,
    pagingTotal: -1,
    pagingData: '', // 二维数组
    pagingIsLoading: false,
    pagingNumTotal: -1, // 加载的 total
  },
  methods: {
    /**
     * 刷新
     */
    pagingRefresh(event?: unknown) {
      // this.setData
      // this.pa
    },

    /**
     * 请求数据
     */
    async pagingTrigger(options: { pagingIndex: number }) {
      if (!this.pagingFetchData) {
        return console.error('pagingFetchData is not defined')
      }
    },

    /**
     * 加载
     */
    pagingLoad(options: any) {
      const { pagingTotal, pagingData, pagingNumTotal, pagingIsLoading, pagingIndex } = this.data
      if (pagingIsLoading) {
        return console.log('正在加载中...')
      }
      if (pagingData && pagingTotal <= pagingNumTotal) {
        return console.log('没有更多了...')
      }
      this.pagingTrigger({ ...options, pagingIndex: pagingIndex + 1 })
    },

    /**
     * 请求配置方法
     */
    async pagingFetchData(pageIndex: number, loading: boolean) {
      return ''
    },
  },
})
