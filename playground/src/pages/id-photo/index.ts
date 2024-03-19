import './index.json'
import './index.wxml'
import './index.scss'

import { createPage, TransferBehavior } from '@codelet/core'

createPage({
  behaviors: [TransferBehavior],
})
