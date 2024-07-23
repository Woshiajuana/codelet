import { createWithError } from '@codelet/core'

import { excludeMessage } from './excludeMessage'

export const withError = createWithError({
  excludeMessage,
  formatMessage: (err: any) => err?.reason ?? err,
})
