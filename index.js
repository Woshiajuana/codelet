const content = `
<button bindtap="handleJump('xxxxxx')">去登录</button>
<button bindchange="handleJump({ x: '1', y })">去登录</button>
`

const srcPattern = /(?<=\bsrc=("|')).*?(?=('|"))/gi
const invPattern = /(?<=\bbind(.*)=").*?(?=")/gi

console.log('srcPattern', content.match(srcPattern))
console.log('invPattern', content.match(invPattern))
