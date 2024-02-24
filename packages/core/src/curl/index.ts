export interface CurlBaseOptions {
  fn?: 'request' | 'uploadFile'
  method?: string
  headers?: { [key: string]: string }
  timeout?: number
  dataType?: string
}

export interface CurlOptions extends CurlBaseOptions {
  url: string
}

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
