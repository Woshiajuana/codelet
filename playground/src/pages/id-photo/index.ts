import './index.json'
import './index.wxml'
import './index.scss'

import { TransferBehavior, createPage } from '@codelet/core'

createPage({
  behaviors: [TransferBehavior],
})
