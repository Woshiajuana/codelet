export type Method =
  | 'GET'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK'
  | 'TRACE'
  | 'CONNECT'

export interface CurlRequestConfig {
  url?: string
  baseURL?: string
  fn?: 'request' | 'uploadFile'
  data?: any
  method?: Method | string
  header?: { [key: string]: string }
  timeout?: number
  dataType?: string
  formData?: any
  responseType?: 'text' | 'arraybuffer'
}

export interface CurlResponse<T = any> {
  data: T
  statusCode: number
  header?: { [key: string]: string }
  exception: any
  profile: any
  cookies: string[]
  config: CurlRequestConfig
}
