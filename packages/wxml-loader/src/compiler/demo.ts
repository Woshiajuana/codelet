import { parse } from './parse.js'
import { serialize } from './serialize.js'
const content = `
<button bindtap="handleJump('xxxxxx')">去登录</button>
<button bindtap="handleJump({ x: '1', y })">去登录</button>
`

const { root: ast } = parse(content)

console.log('ast => ', ast)

const result = serialize(ast)

console.log('result => ', result)
