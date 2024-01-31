import { defineOptions } from './defineOptions'

const AaMixin = defineOptions({
  data: {
    aa: 'aa',
  },
  methods: {
    aaFn() {
      console.log('aa')
    },
  },
})

const BbMixin = defineOptions({
  data: {
    bb: 'bb',
  },
  methods: {
    bbFn() {
      console.log('bb')
    },
  },
})

const DataMixin = defineOptions({
  mixins: [AaMixin, BbMixin],
  data: {
    xx: 1,
  },
  methods: {
    hello() {
      // this.data.xx
      // this.data.aa
      const aa = this.aa
      const bb = this.bb
      const xx = this.xx
      const cc = this.cc
      this.aaFn()
      this.bbFn()
      this.hello()
      return 'hello world'
    },
  },
})
