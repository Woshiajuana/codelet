import { col } from '../codelet'

export function navigateBackByUrl(url: string) {
  const pages = getCurrentPages()
  const index = pages.findIndex((item) => `/${item.route}` === url)
  let delta: number = 0
  if (index > -1) {
    delta = pages.length - index - 1
  }
  if (delta) {
    col.navigateBack({ delta })
  }
  return delta
}
