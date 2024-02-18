import { createBehavior, createPage } from '../create'

export const AuthorizeBehaviors = createBehavior({
  // methods: {
  //   requestAuthorize() {},
  // },
  // requestAuthorize() {},
  methods: {
    requestAuthorize() {},
    xx() {
      this.requestAuthorize()
    },
  },
})

Behavior({
  requestAuthorize() {},
})

Component({
  requestAuthorize() {},
})

Page({
  requestAuthorize() {},
})

createPage({
  requestAuthorize() {},
  xx() {
    this.xx()
  },
})

Page({
  requestAuthorize() {},
  xx() {
    this.requestAuthorize()
  },
})
