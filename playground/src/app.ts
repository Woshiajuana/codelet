import bee, { createApp } from '@bee/core'
import { promise } from '@bee/core/plugins/promise.ts'
import './app.json'
import './app.scss'
import './project.config.json'

bee.use(promise)

createApp({
  onLaunch() {
    Promise.reject().toast('11')
  },
  onError(err) {
    console.error('app onError => ', err)
  },
  onUnhandledRejection(err) {
    console.log('app onUnhandledRejection => ', err)
  },
  onPageNotFound(res) {
    console.log('app onPageNotFound => ', res)
  },
})
