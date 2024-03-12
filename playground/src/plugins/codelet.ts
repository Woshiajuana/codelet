import { userinfoStorage } from '@/utils/storage'
import { definePlugin } from '@codelet/core'
import plugins from '@codelet/core/plugins'

// 需要登录的页面
const NEED_LOGIN_PAGES = ['/pages/mine/index']

// 不需要登录的页面
const UN_NEED_LOGIN_PAGES = ['/pages/login/index']

export default definePlugin((col) => {
  col.use(plugins, {
    promise: {
      formatMessage(err) {
        return err as string
      },
    },
    router: {
      beforeEach(to, from, next) {
        console.log('beforeEach => ', to, from)
        const { url } = to
        const userinfo = userinfoStorage.getItem()
        console.log('userinfo => ', userinfo)
        if (userinfo) {
          // 已登录
          if (UN_NEED_LOGIN_PAGES.includes(url)) {
            // 已登录，如果是登录页，则不处理
            console.log('1')
          } else {
            console.log('2')
            next()
          }
        } else {
          // 未登录
          if (NEED_LOGIN_PAGES.includes(url)) {
            // 未登录，如果是需要登录的页面，则跳转去登录
            console.log('3')
            col.navigateTo('/pages/login/index')
          } else {
            console.log('4')
            next()
          }
        }
      },
    },
  })
})
