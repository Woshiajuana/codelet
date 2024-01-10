import type { LoaderContext } from 'webpack'
import type { CopyLoaderOptions } from './types'
import schema from './schema.json'

const s = schema

export default function loader(this: LoaderContext<CopyLoaderOptions>, source: string) {
  const { entryPath } = this.getOptions(s)
}
