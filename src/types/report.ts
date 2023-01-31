// 用户事件类型
export enum EventTypes {
  Xhr = 'xhr',
  Fetch = 'fetch',
  Click = 'click',
  History = 'history',
  Error = 'error',
  Hashchange = 'hashchange',
  Unhandledrejection = 'unhandledrejection',
  Resource = 'resource',
  Dom = 'dom',
  Vue = 'vue',
  React = 'react',
  Custom = 'custom',
  Performance = 'performance',
  RecordScreen = 'recordScreen',
  WhiteScreen = 'whiteScreen',
}

// 用户行为类型
export enum BreadcrumbTypes {
  Http = 'Http',
  Click = 'Click',
  Resource = 'ResourceError',
  CodeError = 'CodeError',
  Route = 'Route',
  Custom = 'Custom',
}

export interface Breadcrumb {
  category: BreadcrumbTypes
  data: any
  status: 'error' | 'ok'
  time: number
  type: EventTypes
  content?: string
  message?: string
}

export interface DeviceInfo {
  browser_version: string
  browser: string
  os_version: string
  os: string
  ua: string
  device: string
  device_type: string
}

export interface ReportData {
  appKey: string
  breadcrumb: Breadcrumb[]
  fileName: string
  message: string
  page_url: string
  recordScreenId: string
  roleName: string
  sdkName: string
  sdkVersion: string
  status: 'error' | 'ok'
  time: number
  trackerId: string
  type: EventTypes
  username: string
  uuid: string
  _id: string
  deviceInfo: DeviceInfo
  column?: string
  line?: string
  minute?: string
  hour: string
  day: string
  count?: number
  elapsedTime?: number
  url?: string
  isError?: boolean
  request?: any
  response?: any
}
