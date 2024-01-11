import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import InjectChunkWebpackPlugin from '@bee/inject-chunk-webpack-plugin'
import type { Configuration } from 'webpack'
import { defineConfig } from './defineConfig'
import { resolve } from './utils'

export interface Config {
  //
}

export const DEFAULT_CONFIG: Configuration = {
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
            use: [
              {
                loader: 'wxml-loader',
                options: {
                  entryPath: '',
                },
              },
            ],
          },
          {
            test: /\.json$/,
            type: 'javascript/auto',
            use: {
              loader: resolve('build/copy-loader'),
              options: {
                entryPath: '',
              },
            },
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: 'asset/resource',
            generator: {
              filename: 'assets/images/[name][ext]',
            },
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
  ],
}

export const getConfig = (configPath: string) => {
  //
}
