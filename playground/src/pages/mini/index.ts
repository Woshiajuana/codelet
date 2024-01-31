// page.js
import { definePage, reactive, computed } from '@vue-mini/wechat'

definePage({
  mixins: [],
  data: {
    x: 1,
  },
  onLoad() {
    console.log('mini', this.data.x)
    console.log('mini', this.xx())
  },
  xx() {
    this.data.state.count
    return '1'
  },
  setup() {
    this.xx()
    const state = reactive({
      count: 0,
      // double: computed(() => state.count * 2),
    })

    function increment() {
      state.count++
    }

    return {
      state,
      increment,
    }
  },
})
