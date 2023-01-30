import { Config, Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from '../entity/user'
import { decrypt, encrypt } from '../utils/bcrypt'
import { RedisService } from '@midwayjs/redis'
import { JwtService } from '@midwayjs/jwt'
import { CaptchaService } from '@midwayjs/captcha'
import { HttpService } from '@midwayjs/axios'

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>

  @Inject()
  cacheUtil: RedisService

  @Inject()
  jwtUtil: JwtService

  @Inject()
  captchaService: CaptchaService

  @Inject()
  httpService: HttpService

  @Config('jwt')
  jwtConfig

  async register(params: { username: string; password: string }) {
    const user = await this.userModel.findOne({
      username: params.username,
    })
    if (user) {
      return {
        code: 500,
        msg: '用户已存在',
      }
    } else {
      const res = await this.userModel.create({
        username: params.username,
        password: encrypt(params.password),
      })
      if (res) {
        return {
          code: 200,
          msg: '注册成功',
        }
      } else {
        return {
          code: 500,
          msg: '注册失败',
        }
      }
    }
  }

  async login(params: {
    username: string
    password: string
    id: string
    answer: string
  }) {
    const { username, password } = params
    const user = await this.userModel.findOne({
      username,
    })
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
      }
    }
    const flag = decrypt(password, user.password)
    if (!flag) {
      return {
        code: 500,
        msg: '密码不正确',
      }
    }
    const token = await this.jwtUtil.sign({ username })
    const key = 'TOKEN' + ':' + user.username + ':' + token
    const expiresIn = this.jwtConfig.expiresIn
    this.cacheUtil.set(key, JSON.stringify({ username }), 'EX', expiresIn)
    const currentUser = JSON.parse(JSON.stringify(user))
    delete currentUser.password
    return {
      code: 200,
      msg: '登录成功',
      data: {
        user: currentUser,
        token,
      },
    }
  }

  async getCaptcha() {
    const { id, imageBase64 } = await this.captchaService.image({
      width: 120,
      height: 40,
    })
    return {
      data: {
        id,
        imageBase64,
      },
      code: 200,
      msg: '获取成功'
    }
  }

  async checkCaptcha(id: string, answer: string) {
    const passed: boolean = await this.captchaService.check(id, answer)
    return passed
  }
}
