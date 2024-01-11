import path from 'path'
import fg from 'fast-glob'
import fs from 'fs'
import merge from 'webpack-merge'
import { getDefaultConfig } from './config'

export const cmd = process.cwd()

export const resolve = (...args: string[]) => path.resolve(cmd, ...args)

export const parseDir = (entryPath: string, source: string | string[]) => {
  const filepaths = fg.sync(source)
  const entry = filepaths.reduce<Record<string, { import: string; runtime: string }>>(
    (res, filepath) => {
      const relPath = filepath.replace(`${entryPath}${path.sep}`, '')
      const { dir, name } = path.parse(relPath)
      res[path.join(dir, name)] = {
        import: filepath,
        runtime: 'bundle',
      }
      return res
    },
    {},
  )

  return { entry }
}

export function parseArgv(argv: string[]) {
  const [, , option, config] = argv
  if (option === '--config' && !config) {
    throw '请指定配置文件'
  }
  const configPath = resolve(option === '--config' ? config : 'bee.config.js')
  return { configPath }
}

export function getConfig(configPath: string) {
  let config = getDefaultConfig()
  if (fs.existsSync(configPath)) {
    const options = require(configPath)
    if (typeof options === 'function') {
      config = options(config)
    } else {
      config = merge(config, options)
    }
  }

  const { entryPath } = config

  return config
}
