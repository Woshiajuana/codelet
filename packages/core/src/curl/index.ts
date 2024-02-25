import type { CurlBaseOptions } from './types'

export const DEFAULT_OPTIONS = {
  baseURI: '',
  fn: 'request',
  method: 'POST',
  timeout: 60 * 1000,
  dataType: 'json',
}

export class Curl {
  constructor(options: CurlBaseOptions) {
    //
  }
}
