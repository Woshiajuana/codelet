import path from 'path'
import fs from 'node:fs/promises'
import type { LoaderContext } from 'webpack'
import type { WxmlLoaderOptions } from './types'
import schema from './schema.json'

const filepathCaches: string[] = []

export default function loader(
  this: LoaderContext<WxmlLoaderOptions>,
  content: string,
  map: string,
  meta?: any,
) {
  let { entryPath = 'src' } = this.getOptions(schema as any)
  const callback = this.async()

  const pattern = /(?<=\bsrc=("|')).*?(?=('|"))/gi
  const result = content.match(pattern) || []

  entryPath = path.resolve(this.rootContext, entryPath)

  const filepaths = result
    .filter((src) => src.startsWith('.') || src.startsWith('/') || !filepathCaches.includes(src))
    .map((src) => {
      if (src.startsWith('.')) {
        return path.join(this.context, src)
      } else {
        return path.join(entryPath, src)
      }
    })

  Promise.all(
    filepaths.map(async (filepath) => {
      const content = await fs.readFile(filepath)
      const outputPath = filepath.replace(`${entryPath}${path.sep}`, '')
      this.emitFile(outputPath, content)
    }),
  )
    .then(() => filepathCaches.push(...filepaths))
    .catch(callback)
    .finally(() => {
      const outputPath = this.utils.contextify(entryPath, this.resourcePath)
      this.emitFile(outputPath, content)
      callback(null, '', map, meta)
    })

  return
}
