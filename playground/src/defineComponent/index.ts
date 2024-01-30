import { defineComponent } from './apiDefineComponent'

export const AaMixin = defineComponent({
  data() {
    return {
      aa: 'aa',
    }
  },
  methods: {
    aaFn() {
      console.log('aa')
    },
  },
})

export const BbMixin = defineComponent({
  data() {
    return {
      bb: 'bb',
    }
  },
  methods: {
    bbFn() {
      console.log('bb')
    },
  },
})

export const DataMixin = defineComponent({
  mixins: [AaMixin, BbMixin],
  data() {
    return {
      xx: 1,
    }
  },
  methods: {
    hello() {
      const aa = this.aa
      const bb = this.bb
      const xx = this.xx
      const cc = this.cc
      this.aaFn()
      this.bbFn()
      return 'hello world'
    },
  },
})
