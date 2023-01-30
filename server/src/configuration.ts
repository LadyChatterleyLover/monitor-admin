import { Configuration, App } from '@midwayjs/decorator'
import { join } from 'path'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import * as jwt from '@midwayjs/jwt'
import * as redis from '@midwayjs/redis'
import * as oss from '@midwayjs/oss'
import * as upload from '@midwayjs/upload'
import * as captcha from '@midwayjs/captcha'
import * as typegoose from '@midwayjs/typegoose'
import * as crossDomain from '@midwayjs/cross-domain'
import * as axios from '@midwayjs/axios'
import { ReportMiddleware } from './middleware/report.middleware'
import { ValidateErrorFilter } from './filter/validate.filter'
import { SecurityMiddleware } from './middleware/security.middleware'
import { UnauthorizedErrorFilter } from './filter/security.filter'
// import { UnauthorizedErrorFilter } from './filter/security.filter'

@Configuration({
  imports: [
    koa,
    validate,
    typegoose,
    oss,
    jwt,
    redis,
    upload,
    captcha,
    axios,
    crossDomain,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, SecurityMiddleware])
    // add filter
    this.app.useFilter([ValidateErrorFilter, UnauthorizedErrorFilter])
  }
}
