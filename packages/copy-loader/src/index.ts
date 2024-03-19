import path from 'path'
import type { LoaderContext } from 'webpack'

import schema from './schema.json'
import type { CopyLoaderOptions } from './types'

export default function loader(this: LoaderContext<CopyLoaderOptions>, content: string) {
  const { entryPath = 'src' } = this.getOptions(schema as any)

  const outputPath = this.utils.contextify(
    path.resolve(this.rootContext, entryPath),
    this.resourcePath,
  )

  this.emitFile(outputPath, content)

  return ''
}
