import { createStorage } from '@codelet/core'

import type { Userinfo } from '@/types'

// 用户信息
export const userinfoStorage = createStorage<Userinfo>('$$USER_INFO')
