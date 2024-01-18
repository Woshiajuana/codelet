import { Compiler, EntryNormalized } from 'webpack'

const NAME = 'AppJsonWebpackPlugin'

export default class AppJsonWebpackPlugin {
  constructor() {
    //
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap(NAME, (compilation) => {
      // compilation 打包上下文
      console.log('compiler.options.entry => ', compiler.options.entry)

      Object.keys(compilation.assets).forEach((name) => {
        if (name.endsWith('app.json')) {
          console.log('name => ', name)
        }
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
