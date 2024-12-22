import fs from 'node:fs/promises'

import path from 'path'
import type { LoaderContext } from 'webpack'

import compiler from './compiler'
import schema from './schema.json'
import type { WxmlLoaderOptions } from './types'

export default function loader(
  this: LoaderContext<WxmlLoaderOptions>,
  content: string,
  map: string,
  meta?: any,
) {
  // eslint-disable-next-line prefer-const
  let { entryPath = 'src', useCompiler = true } = this.getOptions(schema as any)
  const callback = this.async()

  const pattern = /(?<=\bsrc=("|')).*?(?=('|"))/gi
  const result = content.match(pattern) || []

  entryPath = path.resolve(this.rootContext, entryPath)

  const filepaths = result
    .filter((src) => {
      if (src.startsWith('.') || src.startsWith('/')) {
        const ext = path.extname(src)
        return !(ext.startsWith('.wxs') || ext.startsWith('.wxml'))
      }
      return false
    })
    .map((src) => {
      if (src.startsWith('.')) {
        return path.join(this.context, src)
      } else {
        return path.join(entryPath, src)
      }
    })

  let error: any = null
  Promise.all(
    filepaths.map(async (filepath) => {
      const content = await fs.readFile(filepath)
      const outputPath = filepath.replace(`${entryPath}${path.sep}`, '')
      this.emitFile(outputPath, content)
    }),
  )
    .catch((err) => (error = err))
    .finally(() => {
      // 解析出后缀名
      const outputPath = this.utils
        .contextify(entryPath, this.resourcePath)
        .replace('.html', '.wxml')

      if (useCompiler) {
        const ast = compiler.parse(content)
        this.emitFile(outputPath, compiler.serialize(ast))
      } else {
        this.emitFile(outputPath, content)
      }
      callback(error, '', map, meta)
    })

  return
}
