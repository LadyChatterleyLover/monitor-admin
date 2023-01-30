const bcrypt = require('bcryptjs')
const sha1 = require('sha1')

/**
 * 加密。加上前缀{bcrypt}，为了兼容多种加密算法，这里暂时只实现bcrypt算法
 */
export function encrypt(password: string) {
  const salt = bcrypt.genSaltSync(5)
  const hash = bcrypt.hashSync(password, salt, 64)
  return hash
}

/**
 * 解密
 */
export function decrypt(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export function sha1Encrypt(str: string) {
  return sha1(str)
}
