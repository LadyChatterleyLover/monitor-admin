export interface User {
  username: string
  password: string
  createTime: number
}

export interface UserResult {
  token: string
  user: User
}
