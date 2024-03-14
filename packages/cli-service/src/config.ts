import WebpackBar from 'webpackbar'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import InjectChunkWebpackPlugin from '@codelet/inject-chunk-webpack-plugin'
import AppJsonWebpackPlugin from '@codelet/app-json-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CodeletHMRPlugin from './CodeletHMRPlugin'
import type { Configuration } from 'webpack'
import { resolve } from './utils'

export interface Config {
  /** 开发路径默认 src */
  entryPath?: string
  /** 入口文件 */
  source?: string[]
  /** 第一页 */
  pageIndex?: string
  /** webpack 配置 */
  webpack?: Configuration
}

export function getDefaultConfig(
  options?: Pick<Config, 'entryPath' | 'source' | 'pageIndex'>,
): Required<Config> {
  const { entryPath, source, pageIndex } = Object.assign(
    {
      pageIndex: '',
      entryPath: './src',
      source: ['app.(js|ts)', 'pages/**/*.(js|ts)', 'components/**/*.(js|ts)'],
    },
    options,
  )

  return {
    pageIndex,

    entryPath,

    source,

    webpack: {
      // mode: 'production',
      mode: 'development',

      devtool: false,

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

      plugins: [
        new CodeletHMRPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].wxss',
        }),
        new InjectChunkWebpackPlugin(),
        new AppJsonWebpackPlugin({
          pageIndex,
        }),
        new WebpackBar(),
      ],

      optimization: {
        // minimize: false,
        // minimizer: [
        //   // new TerserWebpackPlugin({
        //   //   // 不生成 license 文件
        //   //   extractComments: false,
        //   // }),
        // ],
        splitChunks: {
          chunks: 'all',
          minChunks: 2,
          minSize: 0,
          cacheGroups: {
            main: {
              name: 'bundle',
              minChunks: 2,
              chunks: 'all',
            },
          },
        },
      },
    },
  }
}
