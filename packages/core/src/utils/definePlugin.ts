import type { Bee } from '../bee'

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

export function definePlugin<T extends Plugin>(plugin: T) {
  return plugin
}
