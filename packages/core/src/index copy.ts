import { defineOptions } from './defineOptions'

const AaMixin = defineOptions({
  mixins: [],
  data: {
    aa: 'aa',
  },
  methods: {
    aaFn() {
      this.data.aa
      console.log('aa')
    },
  },
})

const BbMixin = defineOptions({
  mixins: [AaMixin],
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
  mixins: [BbMixin],
  data: {
    xx: 1,
  },
  // onLoad() {},
  methods: {
    hello() {
      // this.data.xx
      // this.data.aa
      const aa = this.data.aa
      const bb = this.data.bb
      const xx = this.data.xx
      const cc = this.data.cc
      this.aaFn()
      this.bbFn()
      this.hello()
      return 'hello world'
    },
  },
})
