import { InterceptorManner } from './interceptor-manner'
import type { CurlRequestConfig, CurlResponse } from './types'

export const DEFAULT_OPTIONS = {
  baseURL: '',
  fn: 'request',
  method: 'GET',
  timeout: 60 * 1000,
  dataType: 'json',
}

export interface Interceptors {
  request: InterceptorManner<CurlRequestConfig>
  response: InterceptorManner<CurlResponse>
}

export class Curl {
  defaults: CurlRequestConfig = {}
  interceptors: Interceptors = {
    request: new InterceptorManner(),
    response: new InterceptorManner(),
  }

  constructor(config: CurlRequestConfig = {}) {
    this.defaults = Object.assign({}, DEFAULT_OPTIONS, config)
  }

  async request(cfg: CurlRequestConfig = {}) {
    const config = Object.assign({}, this.defaults, cfg) as Required<CurlRequestConfig>
    const { baseURL = '', url = '', fn, data = {} } = config
    if (!url.startsWith('http')) {
      config.url = baseURL + url
    }
    if (fn === 'uploadFile') {
      const { filePath, name, ...formData } = data
      config.filePath = filePath || config.filePath
      config.name = name || config.name
      config.formData = formData || config.formData
      delete config.data
    }

    const dispatchRequest = (options: any) =>
      new Promise<any>((resolve, reject) => {
        wx[fn]({
          ...options,
          success: (res) => resolve({ ...res, config: config }),
          fail: (err) => reject({ ...err, config: config }),
        })
      })

    const chain: any[] = [dispatchRequest, undefined]
    let promise = Promise.resolve<any>(config)
    // 将两个拦截器中的回调加入到chain数组中
    this.interceptors.request.handlers.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    this.interceptors.response.handlers.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    while (chain.length) {
      // promise.then的链式调用，下一个then中的chain为上一个中的返回值，每次会减去两个
      // 这样就实现了在请求的时候，先去调用请求拦截器的内容，再去请求接口，返回之后再去执行响应拦截器的内容
      promise = promise.then(chain.shift(), chain.shift())
      // promise = promise.then(chain.shift());
    }
    return promise
  }
}
