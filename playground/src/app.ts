import './app.json'
import './app.scss'
import './project.private.config.json'
import './project.config.json'

import col, { createApp } from '@codelet/core'

import { handlerError } from './utils'
;((s) => s.keys().forEach((k: any) => s(k).default && col.use(s(k).default)))(
  (require as unknown as NodeRequire).context('./plugins', true, /\.ts$/),
)

createApp({
  onError: handlerError,
  onUnhandledRejection: handlerError,
  onPageNotFound() {
    col.switchTab('/pages/home/index')
  },
})
