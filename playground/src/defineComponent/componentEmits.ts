export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never
export type ObjectEmitsOptions = Record<string, ((...args: any[]) => any) | null>

export type EmitsOptions = ObjectEmitsOptions | string[]

export type EmitsToProps<T extends EmitsOptions> = T extends string[]
  ? {
      [K in `on${Capitalize<T[number]>}`]?: (...args: any[]) => any
    }
  : T extends ObjectEmitsOptions
    ? {
        [K in `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
          ? (
              ...args: T[Uncapitalize<C>] extends (...args: infer P) => any
                ? P
                : T[Uncapitalize<C>] extends null
                  ? any[]
                  : never
            ) => any
          : never
      }
    : {}

export type ShortEmitsToObject<E> = E extends Record<string, any[]>
  ? {
      [K in keyof E]: (...args: E[K]) => any
    }
  : E

export type EmitFn<
  Options = ObjectEmitsOptions,
  Event extends keyof Options = keyof Options,
> = Options extends Array<infer V>
  ? (event: V, ...args: any[]) => void
  : {} extends Options // if the emit is empty object (usually the default value for emit) should be converted to function
    ? (event: string, ...args: any[]) => void
    : UnionToIntersection<
        {
          [key in Event]: Options[key] extends (...args: infer Args) => any
            ? (event: key, ...args: Args) => void
            : Options[key] extends any[]
              ? (event: key, ...args: Options[key]) => void
              : (event: key, ...args: any[]) => void
        }[Event]
      >
