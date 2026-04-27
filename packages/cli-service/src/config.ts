import fg from 'fast-glob'
import AppJsonWebpackPlugin from '@codelet/app-json-webpack-plugin'
import HMRWebpackPlugin from '@codelet/hmr-webpack-plugin'
import InjectChunkWebpackPlugin from '@codelet/inject-chunk-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import type { Chunk, Configuration } from 'webpack'
import WebpackBar from 'webpackbar'

import { resolve } from './utils'

export interface Config {
  /** 开发路径默认 src */
  entryPath?: string
  /** 入口文件 */
  source?: string[]
  /** 不参与打包、运行时 require 的外部脚本 */
  externalSource?: string[]
  /** 第一页 */
  pageIndex?: string
  /** 静态文件 */
  publicDir?: string
  /** webpack 配置 */
  webpack?: Configuration
}

export function getDefaultConfig(
  options?: Omit<Config, 'webpack'> & { isDev?: boolean },
): Required<Config> {
  const { entryPath, source, externalSource, pageIndex, publicDir, isDev } = Object.assign(
    {
      isDev: false,
      pageIndex: '',
      publicDir: 'public',
      externalSource: [],
      entryPath: './src',
      source: [
        'app.(js|ts)',
        '(pages|components)/**/index.(js|ts)',
        'packages/*/(pages|components)/**/index.(js|ts)',
      ],
    },
    options,
  )
  const entryRoot = resolve(entryPath)
  const srcAliasRoot = resolve('src')
  const externalFiles = fg
    .sync(externalSource.map((item) => path.join(entryRoot, item).replace(/\\/g, '/')))
    .map((filepath) => path.resolve(filepath))
  const externalFileSet = new Set(externalFiles)
  const resolveExternalFile = (context: string, request: string) => {
    const candidates: string[] = []

    if (request.startsWith('@/')) {
      candidates.push(path.join(srcAliasRoot, request.slice(2)))
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

  // 模式
  const mode = isDev ? 'development' : 'production'

  // 插件
  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].wxss',
    }),
    new InjectChunkWebpackPlugin(),
    new AppJsonWebpackPlugin({
      pageIndex,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: publicDir, // 源目录
          to: './', // 复制到输出目录（dist）的根路径
          noErrorOnMissing: true, // 若 public 目录不存在时不报错
        },
        ...externalSource.map((pattern) => ({
          context: entryRoot,
          from: pattern,
          to: '[path][name][ext]',
          noErrorOnMissing: true,
        })),
      ],
    }),
    new WebpackBar(),
  ]
  if (isDev) {
    plugins.push(new HMRWebpackPlugin())
  }

  // 优化
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
  const optimization: Configuration['optimization'] = {
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
  // 生产环境
  if (!isDev) {
    optimization.minimize = true
    optimization.minimizer = [
      new TerserWebpackPlugin({
        // 不生成 license 文件
        extractComments: false,
        terserOptions: {
          format: {
            comments: false, // 删除注释
          },
        },
      }),
    ]
  }

  return {
    pageIndex,

    entryPath,

    source,

    externalSource,

    publicDir,

    webpack: {
      mode,

      devtool: false,

      externalsType: 'commonjs',
      externals: [
        ({ context, request }, callback) => {
          if (!context || !request) {
            callback()
            return
          }

          const targetFile = resolveExternalFile(context, request)
          if (!targetFile) {
            callback()
            return
          }

          const relativeRequest = path
            .relative(context, targetFile)
            .replace(/\\/g, '/')
            .replace(/\.js$/, '')
            .replace(/^(?!\.)/, './')

          callback(null, `commonjs ${relativeRequest}`)
        },
      ],

      output: {
        filename: '[name].js',
        path: resolve('dist'),
        publicPath: '/',
        clean: true,
      },

      resolve: {
        alias: {
          '@': resolve('src'),
        },
        extensions: ['.js', '.ts'],
      },

      module: {
        rules: [
          {
            oneOf: [
              {
                test: /\.(css|wxss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
              },
              {
                test: /\.s(a|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
              },
              {
                test: /\.(wxml|html)$/,
                loader: '@codelet/wxml-loader',
                options: {
                  entryPath,
                },
              },
              {
                test: /\.wxs$/,
                loader: '@codelet/copy-loader',
                options: {
                  entryPath,
                },
              },
              {
                test: /\.json$/,
                type: 'javascript/auto',
                loader: '@codelet/copy-loader',
                options: {
                  entryPath,
                },
              },
              {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                  filename: 'assets/images/[name][ext]',
                },
              },
              {
                test: /\.(ts|js)$/,
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启 babel 缓存
                  cacheCompression: false, // 关闭缓存文件压缩
                },
              },
            ],
          },
        ],
      },

      plugins,

      optimization,
    },
  }
}
