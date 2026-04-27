import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'
import type { ObjectPattern } from 'copy-webpack-plugin'
import { Compilation, sources, type Chunk, type Compiler, type Configuration } from 'webpack'
import merge from 'webpack-merge'

import { type Config, getDefaultConfig } from './config'

export const cmd = process.cwd()
export const externalRequestPlaceholderPrefix = '__CODELET_EXTERNAL__/'

export const resolve = (...args: string[]) => path.resolve(cmd, ...args)

export const resolveEntryRoot = (entryPath: string) => resolve(entryPath)

export const resolveSourceRoot = (entryPath: string) => resolveEntryRoot(entryPath)

export const parseDir = (entryPath: string, source: string[]) => {
  entryPath = resolveEntryRoot(entryPath)
  const filepaths = fg.sync(source.map((item) => resolve(entryPath, item).replace(/\\/g, '/')))
  const entry = filepaths.reduce<Record<string, { import: string; runtime: string }>>(
    (res, filepath) => {
      const relPath = path.relative(entryPath, filepath)
      const { dir, name } = path.parse(relPath)
      res[path.join(dir, name)] = {
        import: filepath,
        runtime: 'runtime',
      }
      return res
    },
    {},
  )

  return { entry }
}

export const resolveExternalFiles = (entryPath: string, externalSource: string[]) => {
  const entryRoot = resolveEntryRoot(entryPath)
  return fg
    .sync(externalSource.map((item) => path.join(entryRoot, item).replace(/\\/g, '/')))
    .map((filepath) => path.resolve(filepath))
}

export const createExternalCopyPatterns = (
  entryPath: string,
  externalSource: string[],
): ObjectPattern[] => {
  const entryRoot = resolveEntryRoot(entryPath)
  return externalSource.map((pattern) => ({
    context: entryRoot,
    from: pattern,
    to: '[path][name][ext]',
    noErrorOnMissing: true,
  }))
}

export const createExternalRequestResolver = (options: {
  entryPath: string
  externalFiles: string[]
}) => {
  const entryRoot = resolveEntryRoot(options.entryPath)
  const externalFileSet = new Set(options.externalFiles)

  return (context: string, request: string) => {
    const candidates: string[] = []

    // Support alias imports like "@/libs/foo" and relative imports like "./libs/foo".
    if (request.startsWith('@/')) {
      candidates.push(path.join(entryRoot, request.slice(2)))
    } else if (request.startsWith('.')) {
      candidates.push(path.resolve(context, request))
    } else {
      return ''
    }

    for (const basePath of candidates) {
      for (const ext of ['', '.js']) {
        const candidate = ext ? `${basePath}${ext}` : basePath
        if (externalFileSet.has(path.resolve(candidate))) {
          return path.resolve(candidate)
        }
      }
    }

    return ''
  }
}

export class RewriteExternalRequestPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap('RewriteExternalRequestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'RewriteExternalRequestPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
        },
        (assets) => {
          for (const assetName of Object.keys(assets)) {
            if (!assetName.endsWith('.js')) {
              continue
            }

            const source = assets[assetName].source().toString()
            if (!source.includes(externalRequestPlaceholderPrefix)) {
              continue
            }

            // Recalculate each external require from the final emitted file location,
            // so shared chunks like bundle.js get a correct runtime path too.
            const rewritten = source.replace(
              /__CODELET_EXTERNAL__\/([^"'`]+)/g,
              (_match, target) => {
                return path
                  .relative(path.dirname(assetName), target)
                  .replace(/\\/g, '/')
                  .replace(/^(?!\.)/, './')
              },
            )

            assets[assetName] = new sources.RawSource(rewritten)
          }
        },
      )
    })
  }
}

export const createOptimization = (): NonNullable<Configuration['optimization']> => {
  const packageRootPattern = /[\\/]src[\\/]packages[\\/]([^\\/]+)[\\/]/
  const getPackageBundleName = (name: string) => {
    const normalizedName = name.replace(/\\/g, '/')
    if (normalizedName.startsWith('packages/')) {
      const [, packageName] = normalizedName.split('/')
      if (packageName) {
        return `packages/${packageName}/bundle`
      }
    }
    return null
  }
  const getModuleResource = (module: unknown) => {
    if (!module || typeof module !== 'object') {
      return ''
    }
    return 'resource' in module && typeof module.resource === 'string' ? module.resource : ''
  }

  return {
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      minSize: 0,
      cacheGroups: {
        subpackage: {
          test(module: unknown) {
            return Boolean(getModuleResource(module).match(packageRootPattern))
          },
          name(module: unknown, chunks: Chunk[]) {
            const match = getModuleResource(module).match(packageRootPattern)
            if (!match) {
              return 'bundle'
            }

            const packageBundleName = `packages/${match[1]}/bundle`
            const bundleNames = new Set(
              chunks
                .map((chunk) => chunk.name)
                .filter((name): name is string => typeof name === 'string' && Boolean(name))
                .map((name) => getPackageBundleName(name))
                .filter((name): name is string => typeof name === 'string' && Boolean(name)),
            )

            return bundleNames.size <= 1 && bundleNames.has(packageBundleName)
              ? packageBundleName
              : 'bundle'
          },
          priority: 10,
          minChunks: 2,
          chunks: 'all',
        },
        main: {
          name: 'bundle',
          minChunks: 2,
          chunks: 'all',
        },
      },
    },
  }
}

export function getOptionValue(argv: string[], option: string) {
  const index = argv.findIndex((item) => item === option)
  if (index > -1) {
    return argv[index + 1]
  }
}

export function parseArgv(argv: string[]) {
  const isWatch = argv.includes('--watch')
  const isDev = argv.includes('dev')
  const pageIndex = getOptionValue(argv, '--pageIndex') || ''
  const configRelativePath = getOptionValue(argv, '--config') || 'codelet.config.js'
  const configPath = resolve(configRelativePath)
  return { configPath, isWatch, pageIndex, isDev }
}

export function getConfig(options: {
  configPath: string
  isWatch: boolean
  isDev: boolean
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
      if (options.isDev) {
        cfg.isDev = options.isDev
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
