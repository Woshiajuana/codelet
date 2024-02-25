export interface InterceptorFulfilled {
  (): any
}

export interface InterceptorRejected {
  (): any
}

export interface InterceptorHandler {
  fulfilled?: InterceptorFulfilled
  rejected?: InterceptorRejected
}

export class InterceptorsManner {
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
