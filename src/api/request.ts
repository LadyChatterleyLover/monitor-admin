import axios from 'axios'
import QS from 'qs'
import { Message } from '@arco-design/web-vue'
import type { ResponseType } from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:7001',
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
    config.headers!['Authorization'] = `Bearer ${localStorage.getItem(
      'monitor-token'
    )}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break
        case 401:
          err.message = '未授权，请重新登录'
          window.location.pathname = '/login'
          break
        case 403:
          err.message = '没有访问权限，拒绝访问'
          break
        case 404:
          err.message = '请求错误,未找到该资源'
          break
        case 405:
          err.message = '请求方法未允许'
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务错误'
          break
        case 501:
          err.message = '网络未实现'
          break
        case 502:
          err.message = '网络错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网络超时'
          break
        default:
          err.message = `连接错误`
      }
    } else {
      err.message = '连接到服务器失败'
    }
    Message.error(err.response)
    return Promise.reject(err.response)
  }
)

interface IResponseData<T> {
  data?: T
  code: number
  total?: number
  msg: string
}
//get请求
export function get<T>(
  url: string,
  params?: any,
  responseType?: ResponseType,
  headers?: any
): Promise<IResponseData<T>> {
  return service.get(url, {
    params: params ?? {},
    headers: {
      ...(headers || {}),
    },
    responseType,
  })
}
// post请求
export function post<T>(
  url: string,
  params?: any,
  _object = {}
): Promise<IResponseData<T>> {
  return service.post(url, params, { ..._object })
}

export function postFormData<T>(
  url: string,
  params?: any,
  headers?: any
): Promise<IResponseData<T>> {
  return service.post(url, {
    headers: {
      ...(headers || {}),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: QS.stringify(params) || {},
  })
}
export function put<T>(url: string, params?: any): Promise<IResponseData<T>> {
  return service.put(url, params)
}

export function remove<T>(
  url: string,
  params?: any,
  _object = {}
): Promise<IResponseData<T>> {
  return service.delete(url, {
    params,
    ..._object,
  })
}
