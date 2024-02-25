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
