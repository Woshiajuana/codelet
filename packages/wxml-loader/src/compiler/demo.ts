import { parse } from './parse.js'
import { parsePlus } from './parse-plus.js'
import { serialize } from './serialize.js'
const content = `
<input/>
<xxxx-xx />
<image></image>
<div>登录页面</div>
<div>111</div>
`

// const { root: ast } = parse(content)
const ast = parsePlus(content)

console.log('ast => ', ast)

const result = serialize(ast)

console.log('result => ', result)
