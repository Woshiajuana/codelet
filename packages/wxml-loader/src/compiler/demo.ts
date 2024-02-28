import { parse } from './parse.js'
import { serialize } from './serialize.js'
const content = `
<text>登录页面 {{ xx }}</text>
<button>111</button>
`

const { root: ast } = parse(content)

console.log('ast => ', ast)

const result = serialize(ast)

console.log('result => ', result)
