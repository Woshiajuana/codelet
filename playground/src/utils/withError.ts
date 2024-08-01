import { createWithError } from '@codelet/core'
import { formatMessage } from '@daysnap/utils'

import { excludeMessage } from './excludeMessage'

export const withError = createWithError({
  excludeMessage,
  formatMessage: (err: any) => formatMessage(err?.reason ?? err),
})
