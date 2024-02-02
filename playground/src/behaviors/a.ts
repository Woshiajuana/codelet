import { createBehavior } from '@bee/core'

export const ABehavior = createBehavior({
  data: {
    a: 'a',
  },
  methods: {
    aFn() {
      console.log('aFn')
      return this.data.a
    },
  },
})
