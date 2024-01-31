import path from 'path'
import { Compiler, Compilation, type EntryNormalized } from 'webpack'

const NAME = 'AppJsonWebpackPlugin'

export interface AppJsonWebpackPluginOptions {
  filterPages?: (entryKeys: string[]) => Promise<Record<string, any>>
}

export default class AppJsonWebpackPlugin {
  options: AppJsonWebpackPluginOptions

  constructor(options: AppJsonWebpackPluginOptions = {}) {
    this.options = options
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        async (assets, callback) => {
          try {
            for (const name in assets) {
              if (name.endsWith('app.json')) {
                const appJsonPages = await this.getAppJsonPages(compiler.options.entry)
                const json = JSON.parse(assets[name].source().toString())
                const content = JSON.stringify(Object.assign(json, appJsonPages), null, 2)
                assets[name] = Object.assign({}, assets[name], {
                  source: () => content,
                  size: () => content.length,
                })
              }
            }
            callback()
          } catch (err) {
            callback(err as any)
          }
        },
      )
    })
  }

  async getAppJsonPages(entry: EntryNormalized) {
    const entryData = typeof entry === 'function' ? await entry() : entry
    const entryKeys = Object.keys(entryData)
    if (this.options.filterPages) {
      return this.options.filterPages(entryKeys)
    }

    const source = entryKeys
      .filter((key) => {
        if (key.includes(`components${path.sep}`)) {
          return false
        }
        return key.endsWith(`${path.sep}index`)
      })
      .map((item) => item.split(path.sep).join('/'))

    const pages: string[] = []
    const subpackages: { root: string; name: string; pages: string[] }[] = []
    source.forEach((item) => {
      if (item.startsWith('pages/')) {
        pages.push(item)
      } else {
        const [name, ...rest] = item.split('/')
        let subpackage = subpackages.find((item) => item.name === name)
        if (!subpackage) {
          subpackage = { name, root: name, pages: [] }
          subpackages.push(subpackage)
        }
        subpackage.pages.push(rest.join('/'))
      }
    })

    return { pages, subpackages }
  }
}
