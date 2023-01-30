import { Report } from '../entity/report'
import { Body, Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import * as dayjs from 'dayjs'

export interface Data {
  current: number
  pageSize: number
  appKey: string
  type: string
  startTime?: string | number
  endTime?: string | number
}

@Provide()
export class RepostService {
  @InjectEntityModel(Report)
  reportModel: ReturnModelType<typeof Report>

  async getData(@Body() params: Data) {
    const {
      appKey,
      type,
      current,
      pageSize,
      startTime = '',
      endTime = '',
    } = params
    let query: any = {
      appKey,
      type
    }
    if (startTime && endTime) {
      query.$and = [
        {
          time: { $gt: dayjs(startTime).valueOf() },
        },
        { time: { $lt: dayjs(endTime).valueOf() } },
      ]
    }
    let res = []
    if (current && pageSize) {
      res = await this.reportModel
      .find(query)
      .skip((current - 1) * pageSize)
      .limit(pageSize).sort({time:1})
    } else {
      res = await this.reportModel
      .find(query).sort({time:1})
    }
    const total = await this.reportModel
      .find(query)
      .count()
    return {
      data: res,
      total,
      code: 200,
      msg: '获取成功',
    }
  }

  async report(params) {
    const res = await this.reportModel.create(params)
    if (res) {
      return {
        code: 200,
        msg: '上报成功',
      }
    } else {
      return {
        code: 500,
        msg: '上报失败',
      }
    }
  }
}
