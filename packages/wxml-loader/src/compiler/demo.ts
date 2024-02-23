import { parse } from './parse.js'
const content = `
<button bindtap="handleJump('xxxxxx')">去登录</button>
<button bindtap="handleJump({ x: '1', y })">去登录</button>
`

const ast = parse(content)

console.log('ast => ', ast)
