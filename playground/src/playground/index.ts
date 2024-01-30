import { defineOptions } from './defineOptions'

const AaMixin = defineOptions({
  data: {
    aa: 'aa',
  },
  aaFn() {
    console.log('aa')
  },
})

const BbMixin = defineOptions({
  data: {
    bb: 'bb',
  },
  bbFn() {
    console.log('bb')
  },
})

const DataMixin = defineOptions({
  mixins: [AaMixin, BbMixin],
  data: {
    xx: 1,
  },
  hello() {
    // this.data.xx
    // this.data.aa
    const aa = this.aa
    const bb = this.bb
    const xx = this.xx
    const cc = this.cc
    this.aaFn()
    this.bbFn()
    return 'hello world'
  },
})
