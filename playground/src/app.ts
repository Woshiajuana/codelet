import col, { createApp } from '@codelet/core'

import './app.json'
import './app.scss'
import './project.config.json'
;((s) => s.keys().forEach((k: any) => s(k).default && col.use(s(k).default)))(
  (require as unknown as NodeRequire).context('./plugins', true, /\.ts$/),
)

createApp({
  onLaunch(options) {},
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
