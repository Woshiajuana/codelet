import type { Config } from './config'

export function defineConfig(config: Config | ((config: Config) => Config)) {
  return config
}
