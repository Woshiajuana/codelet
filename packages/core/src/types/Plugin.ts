import type { Bee } from './Bee'

type PluginInstallFunction<Options> = Options extends unknown[]
  ? (bee: Bee, ...options: Options) => any
  : (bee: Bee, options: Options) => any

export type Plugin<Options = any[]> =
  | (PluginInstallFunction<Options> & {
      install?: PluginInstallFunction<Options>
    })
  | {
      install: PluginInstallFunction<Options>
    }
