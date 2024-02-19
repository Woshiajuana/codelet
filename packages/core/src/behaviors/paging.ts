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
    pagingRefresh() {
      //
    },

    /**
     * 请求数据
     */
    pagingTrigger(options: { pagingIndex: number }) {
      //
    },

    /**
     * 加载
     */
    pagingLoad() {
      //
    },

    /**
     * 请求配置方法
     */
    pagingDefineConfig() {
      //
    },
  },
})
