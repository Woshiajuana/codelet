import { isPromiseLike } from '@daysnap/utils'

const NativePromise = globalThis.Promise

export type UnhandledRejectionErrorHandler = (reason: unknown) => void

export function createUnhandledRejectionPromise(
  onError: UnhandledRejectionErrorHandler,
): PromiseConstructor {
  return class UnhandledRejectionPromise<T> extends NativePromise<T> {
    private _handled = false

    static get [Symbol.species]() {
      return NativePromise
    }

    constructor(
      executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void,
      ) => void,
    ) {
      super((resolve, reject) => {
        let settled = false

        const reportUnhandled = (reason: any) => {
          setTimeout(() => {
            if (!this._handled) {
              onError(reason)
            }
          })
        }

        const rejectWithReport = (reason?: any) => {
          if (settled) return
          settled = true
          reject(reason)
          reportUnhandled(reason)
        }

        const resolveWithThenable = (value: T | PromiseLike<T>) => {
          if (settled) return

          let promiseLike = false
          try {
            promiseLike = isPromiseLike<T>(value)
          } catch (reason) {
            rejectWithReport(reason)
            return
          }

          settled = true

          if (promiseLike) {
            try {
              NativePromise.resolve(value).then(resolve, (reason) => {
                reject(reason)
                reportUnhandled(reason)
              })
            } catch (reason) {
              reject(reason)
              reportUnhandled(reason)
            }
            return
          }

          resolve(value)
        }

        try {
          executor(resolveWithThenable, rejectWithReport)
        } catch (reason) {
          rejectWithReport(reason)
        }
      })
    }

    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
      this._handled = true
      return super.then(onfulfilled, onrejected)
    }

    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): Promise<T | TResult> {
      this._handled = true
      return super.catch(onrejected)
    }

    finally(onfinally?: (() => void) | null): Promise<T> {
      this._handled = true
      return super.finally(onfinally)
    }
  }
}
