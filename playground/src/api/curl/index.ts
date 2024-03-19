import { Curl, type CurlRequestConfig } from '@codelet/core'

import { log } from './log'

export const baseURL = ''

const instance = new Curl({
  baseURL,
  header: {},
  timeout: 10000,
})

// 日志输出
instance.interceptors.request.use(
  (config) =>
    new Promise((resolve) => {
      const { url, method, data } = config
      console.log(`${url} [${method}] 请求参数 => `, data)
      resolve(config)
    }),
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log('response', response)
    // 对响应数据做点什么
    const { data: respData } = response
    // log(config, '请求返回 => ', respData)

    // if (!respData) {
    //   return Promise.reject(`网络繁忙，请稍后再试(1)`)
    // }

    // // eslint-disable-next-line prefer-const
    // let { status, message, data } = respData
    // // token 过期
    // if ([2].includes(status)) {
    //   return Promise.reject(`登录已失效，请重新登录`)
    // }
    // if (status !== 0) {
    //   // 处理 err 在 data 的情况
    //   if (!message) {
    //     const errors: any[] = data?.errors
    //     if (errors && errors.length) {
    //       message = errors.map((item) => item.description).join(' ')
    //     }
    //   }
    //   return Promise.reject(message || `网络繁忙，请稍后再试(2)`)
    // }

    // return data
    return response
  },
  (error) => {
    log(error.config, '请求错误 => ', error)

    if (error && error.response) {
      const { status, data: respData } = error.response
      error = status ? `网络繁忙，请稍后再试[${status}]` : `网络繁忙，请稍后再试(3)`
      if (respData && respData.message) {
        error = respData.message
      }
    } else if (error && error.message) {
      error = error.message
    } else {
      error = `网络繁忙，请稍后再试(4)`
    }
    return Promise.reject(error)
  },
)

export function curl<T = any>(
  url: string,
  data: Record<string, any> = {},
  options: CurlRequestConfig = {},
): Promise<T> {
  return instance.request({
    ...options,
    url,
    data,
  })
}
