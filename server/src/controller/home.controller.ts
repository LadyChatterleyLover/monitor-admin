import { RepostService } from '../service/report.service'
import { Body, Controller, Inject, Post } from '@midwayjs/decorator'

@Controller('/')
export class HomeController {
  @Inject()
  repostService: RepostService

  @Post('/reportData')
  async home(@Body() params) {
    return await this.repostService.report(params)
  }

  @Post('/getData')
  async getData(
    @Body() params: { current: number; pageSize: number; appKey: string }
  ) {
    return await this.repostService.getData(params)
  }
}
