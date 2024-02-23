import { parse } from './parse.js'
const content = `
  parse
`

const ast = parse(content)

console.log('ast => ', ast)
