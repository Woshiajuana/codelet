export type PromisifySuccessResult<
  P,
  T extends { success?: (...args: any[]) => void },
> = P extends {
  success: any
}
  ? void
  : P extends { fail: any }
    ? void
    : P extends { complete: any }
      ? void
      : Promise<Parameters<Exclude<T['success'], undefined>>[0]>

export type PromisifyRestArgs<T> = T extends [any, ...args: infer P] ? P : never

export function promisify<T extends (...args: any[]) => any>(fn: T) {
  return function <P extends Parameters<T>[0]>(
    options?: P,
    ...args: PromisifyRestArgs<Parameters<T>>
  ): PromisifySuccessResult<P, Parameters<T>[0]> {
    const { success, fail, complete } = options as any

    if (success || fail || complete) {
      return fn(options, ...args)
    }

    return new Promise((resolve, reject) => {
      return fn({ ...options, fail: reject, success: resolve }, ...args)
    }) as any
  }
}
