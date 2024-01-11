// import { webpack } from 'webpack'
import { bootstrap } from './bootstrap'
import { parseDir, resolve } from './utils'

const [, , command] = process.argv
const cmd = process.cwd()

const entryPath = resolve('src')
const outputPath = resolve('dist')
const { entry } = parseDir(entryPath, [resolve(entryPath, 'app.js')])

console.log('process.argv => ', cmd, command)
console.log('entryPath => ', entryPath)
console.log('outputPath => ', outputPath)
console.log('entry => ', entry)

bootstrap(process.argv).catch((err) => {
  console.error(err)
  process.exit(1)
})
