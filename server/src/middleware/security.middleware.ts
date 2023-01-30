// src/middleware/security.middleware.ts
import { Config, Inject, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'
import { httpError } from '@midwayjs/core'
import { JwtService } from '@midwayjs/jwt'
import { RedisService } from '@midwayjs/redis'
import { InjectEntityModel } from '@midwayjs/typegoose'
import { User } from '../entity/user'
import { ReturnModelType } from '@typegoose/typegoose'

class UserContext {
  username: string
  constructor(username: string) {
    this.username = username
  }
}

/**
 * 安全验证
 */
@Middleware()
export class SecurityMiddleware {
  @Inject()
  jwtUtil: JwtService

  @Inject()
  cacheUtil: RedisService

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>

  @Config('app.security')
  securityConfig

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('缺少凭证')
      }
      const parts = ctx.get('authorization').trim().split(' ')
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('无效的凭证')
      }
      const [scheme, token] = parts
      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError('缺少Bearer')
      }
      // 验证token，过期会抛出异常
      const jwt = await this.jwtUtil.verify(token, { complete: true })
      // jwt中存储的user信息
      const payload = jwt['payload']
      const key = 'TOKEN' + ':' + payload.username + ':' + token
      const ucStr = await this.cacheUtil.get(key)
      const user = await this.userModel.findOne({ username: payload.username })
      // 服务器端缓存中存储的user信息
      const uc: UserContext = JSON.parse(ucStr)
      if (payload.username !== uc.username) {
        throw new httpError.UnauthorizedError('无效的凭证')
      }
      // 存储到访问上下文中
      ctx.userContext = user
      return next()
    }
  }

  public match(ctx: Context): boolean {
    const ignore =
      ctx.path.indexOf('/user') !== -1 ||
      ctx.path.indexOf('/report') !== -1 ||
      ctx.path.indexOf('/getData') !== -1
    return !ignore
  }

  public static getName(): string {
    return 'SECURITY'
  }
}
