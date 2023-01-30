import { get, post } from './request'
import type { UserResult } from '@/types/user'

export default {
  login(params: {
    username: string
    password: string
    id: string
    answer: string
  }) {
    return post<UserResult>('/user/login', params)
  },
  getCaptcha() {
    return get<{ id: string; imageBase64: string }>('/user/captcha')
  },
}
