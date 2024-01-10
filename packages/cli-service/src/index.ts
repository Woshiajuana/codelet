// import { webpack } from 'webpack'
import { resolve } from './utils'

const [, , command] = process.argv
const cmd = process.cwd()

const entryPath = resolve('src')
const outputPath = resolve('dist')

console.log('process.argv => ', cmd, command)
console.log('entryPath => ', entryPath)
console.log('outputPath => ', outputPath)

// webpack({
//   mode: 'production',
//   entry: '',
// })
