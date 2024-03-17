export interface InterceptorFulfilled<T> {
  (config: T): T | Promise<T>
}

export interface InterceptorRejected {
  (err: any): any
}

export interface InterceptorHandler<T> {
  fulfilled?: InterceptorFulfilled<T>
  rejected?: InterceptorRejected
}

export class InterceptorManner<T> {
  constructor() {}
  handlers: InterceptorHandler<T>[] = []
  use(fulfilled?: InterceptorFulfilled<T>, rejected?: InterceptorRejected) {
    const length = this.handlers.push({ fulfilled, rejected })
    return length - 1
  }
  eject(index: number) {
    if (this.handlers[index]) {
      this.handlers.splice(index, 1)
    }
  }
}
