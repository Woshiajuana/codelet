export function currentTick(route: string, callback: () => any) {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] || {}
  if (page.route === route) {
    callback()
  }
}
