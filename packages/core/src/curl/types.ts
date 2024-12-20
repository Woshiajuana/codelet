export type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

export interface CurlRequestConfig {
  url?: string
  baseURL?: string
  fn?: 'request' | 'uploadFile'
  data?: any
  method?: Method
  header?: { [key: string]: string }
  timeout?: number
  name?: string
  filePath?: string
  dataType?: string
  formData?: any
  responseType?: 'text' | 'arraybuffer'
  [key: string]: any
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
