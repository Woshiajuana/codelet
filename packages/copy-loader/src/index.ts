import path from 'path'
import type { LoaderContext } from 'webpack'
import type { CopyLoaderOptions } from './types'
import schema from './schema.json'

export default function loader(this: LoaderContext<CopyLoaderOptions>, content: string) {
  const { entryPath } = this.getOptions(schema as any)

  const outputPath = this.resourcePath.replace(`${entryPath}${path.sep}`, '')

  this.emitFile(outputPath, content)

  return ''
}
