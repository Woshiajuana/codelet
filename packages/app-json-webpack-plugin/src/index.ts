import { Compiler } from 'webpack'

const NAME = 'AppJsonWebpackPlugin'

export default class AppJsonWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tap(NAME, (compilation) => {
      // compilation 打包上下文
      Object.keys(compilation.assets).forEach((name) => {
        console.log('name => ')
      })
      // for (const name in compilation.assets) {
      //   if (name.endsWith('.js')) {
      //     const content = compilation.assets[name].source()
      //     const withoutComments = content.replace(/\/\*\*+\*\//g, '')
      //     compilation.assets[name] = {
      //       source: () => withoutComments,
      //       size: () => withoutComments.length,
      //     }
      //   }
      // }
    })
  }
}
