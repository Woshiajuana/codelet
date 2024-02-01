import { createApp } from '@bee/core'
import './app.json'
import './app.scss'
import './project.config.json'

createApp({
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
