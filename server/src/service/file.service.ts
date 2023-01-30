import { Inject, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { File } from '../entity/file'
import { OSSService } from '@midwayjs/oss'

export interface UploadFile {
  fieldname: string
  data: string
  filename: string
  mimeType: string
  _ext: string
}

@Provide()
export class FileService {
  @InjectEntityModel(File)
  fileModel: ReturnModelType<typeof File>

  @Inject()
  ossService: OSSService

  async upload(name: string, file: UploadFile, user_id: string, ext: string) {
    const url = await this.uploadFile(name, file.data)
    const res = await this.fileModel.create({
      name,
      ext,
      url,
      user_id,
    })
    if (res) {
      return {
        code: 200,
        msg: '上传成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '上传失败',
      }
    }
  }

  async uploadFile(name: string, file: any) {
    let res
    try {
      res = await this.ossService.put(name, file)
      // 将文件设置为公共可读
      await this.ossService.putACL(name, 'public-read')
    } catch (error) {
      console.log(error)
    }
    return res.url
  }
}
