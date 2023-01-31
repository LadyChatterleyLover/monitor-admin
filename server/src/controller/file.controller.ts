import { Body, Controller, Files, Inject, Post } from '@midwayjs/decorator'
import { FileService } from '../service/file.service'

@Controller('/file')
export class HomeController {
  @Inject()
  ctx

  @Inject()
  fileService: FileService

  @Post('/upload')
  async upload(@Files() files) {
    const file = files[0]
    const name = file.filename
    return this.fileService.upload(
      name,
      file,
      this.ctx.userContext._id,
      file._ext
    )
  }

  @Post('/readContent')
  async readContent(@Body() params: {url: string}) {
    return await this.fileService.readContent(params.url)
  }
}
