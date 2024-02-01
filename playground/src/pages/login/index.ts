import './index.json'
import './index.wxml'
import './index.scss'
import { createPage, createBehavior } from '@bee/core'

const a = createBehavior({
  data: {
    a: 'a',
  },
  properties: {
    ap: {
      type: Number,
      value: 1,
    },
  },
  pageLifetimes: {},
  lifetimes: {
    attached() {
      console.log('a => ', this.data.ap)
      console.log('a => ', this.data.a)
    },
    detached() {
      //
    },
  },
  methods: {
    aFn() {
      console.log(this.data.ap)
      console.log(this.data.a)
      console.log(this.data.xx)
    },
  },
})

const b = createBehavior({
  data: {
    b: 'b',
  },
  properties: {
    bp: {
      type: Number,
      value: 1,
    },
  },
  methods: {
    bFn() {
      console.log(this.data.bp)
      console.log(this.data.b)
    },
  },
})

const c = createBehavior({
  behaviors: [a],
  data: {
    c: 'c',
  },
  properties: {
    cp: {
      type: Number,
      value: 1,
    },
  },
  methods: {
    cFn() {
      console.log(this.data.cp)
      console.log(this.data.a)
      console.log(this.data.c)
      this.aFn()
      this.xxxx()
      this.cFn()
    },

    xxxx() {},
  },
})

createPage({
  behaviors: [b, c],
  onLoad() {
    const a = this.data.a
    const b = this.data.b
    const c = this.data.c
    console.log(a, b, c)
    this.aFn()
    this.bFn()
    this.cFn()
    this.test()
  },
  test() {},
})
