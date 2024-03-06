import col, { createApp } from '@codelet/core'
import { promise } from '@codelet/core/plugins/promise.ts'
import { apiProxy } from '@codelet/core/plugins/api-proxy.ts'
import { apiOverwrite } from '@codelet/core/plugins/api-overwrite/index.ts'
import { router } from '@codelet/core/plugins/router.ts'

import './app.json'
import './app.scss'
import './project.config.json'

col.use(apiProxy)
col.use(apiOverwrite)
col.use(promise)
col.use(router)

createApp({
  onLaunch() {},
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
