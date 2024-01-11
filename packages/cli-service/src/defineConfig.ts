import type { Configuration } from 'webpack'

export function defineConfig(config: Configuration | ((config: Configuration) => Configuration)) {
  return config
}
