import type { Compiler } from 'webpack'

const NAME = 'HMRWebpackPlugin'

// https://github.com/NervJS/taro/pull/14854
export default class HMRWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      compilation.hooks.beforeChunkAssets.tap(NAME, () => {
        compilation.chunks.forEach((chunk) => {
          if (chunk.hasRuntime() && chunk.name === 'bundle') {
            const runtimeModules = compilation.chunkGraph.getChunkRuntimeModulesInOrder(chunk)
            for (const module of runtimeModules) {
              if (module.name === 'jsonp chunk loading') {
                const runtimeSource: any = compilation.codeGenerationResults.getSource(
                  module,
                  chunk.runtime,
                  'runtime',
                )
                runtimeSource._value += `
                var miniHMRCallback = function(parentChunkLoadingFunction, data) {
                  var chunkIds = data[0];
                  var moreModules = data[1];
                  if(chunkIds.some(function(id) { return installedChunks[id] === 0 })) {
                    chunkIds.forEach(id => {
                      delete installedChunks[id]
                    })
                    Object.keys(moreModules).forEach(id => {
                      delete __webpack_module_cache__[id]
                    })
                  }
                  if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
                }
                chunkLoadingGlobal.push = miniHMRCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
                `
              }
            }
          }
        })
      })
    })
  }
}
