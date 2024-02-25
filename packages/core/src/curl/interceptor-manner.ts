import type { CurlRequestConfig } from './types'

export interface InterceptorFulfilled {
  (config: CurlRequestConfig): any
}

export interface InterceptorRejected {
  (err: any): any
}

export interface InterceptorHandler {
  fulfilled?: InterceptorFulfilled
  rejected?: InterceptorRejected
}

export class InterceptorManner {
  constructor() {}
  handlers: InterceptorHandler[] = []
  use(fulfilled?: InterceptorFulfilled, rejected?: InterceptorRejected) {
    const length = this.handlers.push({ fulfilled, rejected })
    return length - 1
  }
  eject(index: number) {
    if (this.handlers[index]) {
      this.handlers.splice(index, 1)
    }
  }
}
