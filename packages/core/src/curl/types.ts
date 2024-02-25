export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export interface CurlRequestConfig {
  url?: string
  baseURI?: string
  fn?: 'request' | 'uploadFile'
  data?: any
  method?: Method | string
  headers?: { [key: string]: string }
  timeout?: number
  dataType?: string
  formData?: any
  responseType?: 'text' | 'arraybuffer'
}
