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

function omit<T extends object, K extends keyof T>(obj: T, fields: K[] = []): Omit<T, K> {
  const clone = { ...obj }

  fields.forEach((key) => {
    delete clone[key]
  })

  return clone
}

export function getConfig(options: {
  configPath: string
  isWatch: boolean
  pageIndex: string
}): Configuration {
  const { configPath, isWatch, pageIndex } = options

  let config: Config
  if (fs.existsSync(configPath)) {
    const cfg = require(configPath)
    if (typeof cfg === 'function') {
      config = getDefaultConfig(options)
      if (pageIndex) {
        config.pageIndex = pageIndex
      }
      config = cfg(config)
    } else {
      if (pageIndex) {
        cfg.pageIndex = pageIndex
      }
      config = getDefaultConfig(cfg)
      // 为了解决 webpack-merge 合并报错的问题
      const key: any = ['source', 'pageIndex', 'entryPath']
      config = {
        ...config,
        ...cfg,
        ...merge(omit(config, key), omit(cfg, key)),
      }
    }
  } else {
    config = getDefaultConfig(options)
  }

  const { entryPath, source, ...rest } = omit(config, ['pageIndex'])
  if (!rest.entry && entryPath && source) {
    const { entry } = parseDir(entryPath, source)
    rest.entry = entry
  }

  if (isWatch) {
    rest.watch = true
  }

  return rest
}
