import path from 'path'
import fg from 'fast-glob'
import fs from 'fs'
import merge from 'webpack-merge'
import type { Configuration } from 'webpack'
import { getDefaultConfig, type Config } from './config'

export const cmd = process.cwd()

export const resolve = (...args: string[]) => path.resolve(cmd, ...args)

export const parseDir = (entryPath: string, source: string[]) => {
  entryPath = resolve(entryPath)
  const filepaths = fg.sync(source.map((item) => resolve(entryPath, item)))
  const entry = filepaths.reduce<Record<string, { import: string; runtime: string }>>(
    (res, filepath) => {
      const relPath = path.relative(entryPath, filepath)
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

export function getOptionValue(argv: string[], option: string) {
  const index = argv.findIndex((item) => item === option)
  if (index > -1) {
    return argv[index + 1]
  }
}

export function parseArgv(argv: string[]) {
  const isWatch = argv.includes('--watch')
  const pageIndex = getOptionValue(argv, '--pageIndex') || ''
  const configRelativePath = getOptionValue(argv, '--config') || 'codelet.config.js'
  const configPath = resolve(configRelativePath)
  return { configPath, isWatch, pageIndex }
}

export function getConfig(options: {
  configPath: string
  isWatch: boolean
  pageIndex: string
}): Configuration {
  const { configPath, isWatch } = options

  let config: Required<Config>
  if (fs.existsSync(configPath)) {
    const cfg = require(configPath)
    if (typeof cfg === 'function') {
      config = getDefaultConfig(options)
      config = cfg(config)
    } else {
      if (options.pageIndex) {
        cfg.pageIndex = options.pageIndex
      }
      config = getDefaultConfig(cfg)
      config = {
        ...config,
        ...cfg,
        ...merge(config.webpack ?? {}, cfg.webpack ?? {}),
      }
    }
  } else {
    config = getDefaultConfig(options)
  }

  const { entryPath, source, webpack } = config
  if (!webpack.entry) {
    const { entry } = parseDir(entryPath, source)
    webpack.entry = entry
  }

  if (isWatch) {
    webpack.watch = true
  }

  return webpack
}
