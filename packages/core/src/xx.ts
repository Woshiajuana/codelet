export const x = Behavior({
  data: {
    x: '1',
  },
  methods: {
    xFn() {
      this.data.x
    },
  },
})

export const b = Behavior({
  behaviors: [x],
  data: {
    b: 'b',
  },
  methods: {
    bFn() {
      const b = this.data.b
      const x = this.data.x
    },
  },
})
