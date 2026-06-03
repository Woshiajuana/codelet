import { createWithToast } from '@daysnap/utils'
import { handleError } from './handleError'

export const withToast = createWithToast({
  onError: handleError,
})
