import { Inject, Controller, Post, Body, Get } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { UserService } from '../service/user.service'
import { UserDTO } from '../dto/user'
import { Validate } from '@midwayjs/validate'
import { RedisService } from '@midwayjs/redis'

@Controller('/user')
export class APIController {
  @Inject()
  ctx: Context

  @Inject()
  userService: UserService

  @Inject()
  cacheUtil: RedisService

  @Post('/register')
  @Validate()
  async register(@Body() user) {
    return await this.userService.register(user)
  }

  @Post('/login')
  @Validate()
  async login(@Body() user: UserDTO) {
    const { id, answer } = user
    const passed = await this.checkCaptcha({ id, answer })
    if (!passed) {
      return {
        code: 500,
        msg: '验证码错误',
      }
    } else {
      return await this.userService.login(user)
    }
  }

  @Get('/captcha')
  async getCaptcha() {
    return await this.userService.getCaptcha()
  }

  @Post('/checkCaptcha')
  async checkCaptcha(@Body() body: { id: string; answer: string }) {
    const { id, answer } = body
    return await this.userService.checkCaptcha(id, answer)
  }

}
