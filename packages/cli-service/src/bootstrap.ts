import webpack from 'webpack'
import { parseArgv, getConfig } from './utils'

export async function bootstrap(argv: string[]) {
  const { configPath } = parseArgv(argv)
  const config = getConfig(configPath)
  console.log('config => ', config)
  return new Promise<void>((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        reject(err)
        return
      }
      if (stats) {
        console.log(
          stats.toString({
            chunks: false,
            colors: true,
          }),
        )
      }
      process.stdin.on('end', () => {
        resolve()
        process.exit(0)
      })
      process.stdin.resume()
      // resolve()
    })
  })
}
