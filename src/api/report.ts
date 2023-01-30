import { post } from './request'
import type { ReportData } from '@/types/report'

export default {
  getData(params: {
    appKey: string
    current: number
    pageSize: number
    startTime?: string
    endTime?: string
  }) {
    return post<ReportData[]>('/getData', params)
  },
}
