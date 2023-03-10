import { post } from './request'
import type { ReportData } from '@/types/report'
import type { Dayjs } from 'dayjs'

export default {
  getData(params: {
    appKey: string
    type: string
    current?: number
    pageSize?: number
    startTime?: string | Dayjs
    endTime?: string | Dayjs
  }) {
    return post<ReportData[]>('/getData', params)
  },
  upload(params: FormData) {
    return post<File>('/file/upload', params)
  },
  readContent(params: { url: string }) {
    return post('/file/readContent', params)
  },
}
