import bee, { createApp } from '@bee/core'
import { promise } from '@bee/core/plugins/promise.ts'
import { apiProxy } from '@bee/core/plugins/api-proxy.ts'
import { apiOverwrite } from '@bee/core/plugins/api-overwrite/index.ts'

import './app.json'
import './app.scss'
import './project.config.json'

bee.use(apiProxy)
bee.use(apiOverwrite)
bee.use(promise)

bee
  .showLoading({
    title: '1',
  })
  .then(() => {
    //
  })

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
