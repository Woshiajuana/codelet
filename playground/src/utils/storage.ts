import type { Userinfo } from '@/types'
import { createStorage } from '@codelet/core'

// 用户信息
export const userinfoStorage = createStorage<Userinfo>('$$USER_INFO')
