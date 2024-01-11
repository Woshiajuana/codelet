import { parseArgv, getConfig } from './utils'

export async function bootstrap(argv: string[]) {
  const { configPath } = parseArgv(argv)
  const config = getConfig(configPath)
  console.log('config => ', config)
}
