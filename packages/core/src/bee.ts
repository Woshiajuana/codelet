type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

export type Bee = Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

function createBee() {
  const bee = {}
  console.log('createBeecreateBeecreateBeecreateBee')
  return bee as Bee
}

export const bee = createBee()
