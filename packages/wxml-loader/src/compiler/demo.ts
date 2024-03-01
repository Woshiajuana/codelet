import { parse } from './parse.js'
import { serialize } from './serialize.js'
const content = `
<input></input>
1122
<xxxx-xx />
<image src="xxxxx"></image>
<div bindtap="handleTap('xxx')">登录页面</div>
<div bindtap="handleClick(xxx)">111</div>
`
const ast = parse(content)

console.log('ast => ', ast)

const result = serialize(ast)

console.log('result => ', result)
