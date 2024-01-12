import WebpackBar from 'webpackbar'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import InjectChunkWebpackPlugin from '@bee/inject-chunk-webpack-plugin'
import type { Configuration } from 'webpack'
import { resolve } from './utils'

export interface Config extends Configuration {
  /** 开发路径默认 src */
  entryPath?: string
  source?: string[]
}

export function getDefaultConfig(): Configuration & {
  entryPath: string
  source: string[]
} {
  const entryPath = './src'

  return {
    entryPath,

    source: ['app.(js|ts)', 'pages/**/*.(js|ts)', 'components/**/*.(js|ts)'],

    mode: 'production',

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
              test: /\.wxml$/,
              loader: '@bee/wxml-loader',
              options: {
                entryPath,
              },
            },
            {
              test: /\.wxs$/,
              loader: '@bee/copy-loader',
              options: {
                entryPath,
              },
            },
            {
              test: /\.json$/,
              type: 'javascript/auto',
              loader: '@bee/copy-loader',
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
              exclude: /node_modules/,
            },
          ],
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].wxss',
      }),
      new InjectChunkWebpackPlugin(),
      new WebpackBar(),
    ],

    optimization: {
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
  }
}