import type { Codelet } from '../codelet'

type PluginInstallFunction<Options> = Options extends unknown[]
  ? (col: Codelet, ...options: Options) => any
  : (col: Codelet, options: Options) => any

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
