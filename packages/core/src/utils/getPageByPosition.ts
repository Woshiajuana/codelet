/**
 * 获取页面 实例
 * 默认获取当前页面
 * */
export function getPageByPosition(index = 0) {
  const pages = getCurrentPages()
  return pages[pages.length - 1 - index]
}
