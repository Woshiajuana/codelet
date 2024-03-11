import { parse } from './parse.js'
import { serialize } from './serialize.js'
const content = `
<view class="menu-item">
  <view class="iconfont {{ item.icon }}"></view>
  <text>{{ item.name }}</text>
</view>
<input class="xxx {{ item.icon }}" data="{{ xx }}" />
`
const ast = parse(content)

console.log('ast => ', ast)

const result = serialize(ast)

console.log('result => ', result)
