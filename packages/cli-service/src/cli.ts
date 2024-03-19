import webpack, { Stats } from 'webpack'

import { getConfig, parseArgv } from './utils'

const argv = process.argv
const options = parseArgv(argv)

const config = getConfig(options)

const callback = (err?: Error | null, stats?: Stats) => {
  if (err) {
    throw err
  }
  if (stats) {
    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      }),
    )
  }
}

if (config.watch) {
  webpack(config, callback)
} else {
  webpack(config).run(callback)
}

// 退出
process.on('SIGINT', () => {
  process.exit()
})
process.on('SIGTERM', () => {
  process.exit()
})
