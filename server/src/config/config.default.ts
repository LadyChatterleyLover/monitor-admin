import { Report } from './../entity/report'
import { MidwayConfig } from '@midwayjs/core'
import { User } from '../entity/user'
import { File } from '../entity/file'

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1673864521368_6839',
  koa: {
    port: 7001,
  },
  cors: {
    credentials: false,
  },
  jwt: {
    secret: 'midway',
    expiresIn: 60 * 60 * 24,
  },
  redis: {
    client: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/monitor',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: [User, File, Report],
      },
    },
  },
  oss: {
    // normal oss bucket
    client: {
      accessKeyId: 'LTAIX30SSLbiVE9J',
      accessKeySecret: 'ZIcnc8kgZKpa6nkOuaEaKFKmLj8W1g',
      bucket: 'lp-disk',
      endpoint: 'oss-cn-chengdu.aliyuncs.com',
      timeout: '60s',
    },
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '10mb',
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    whitelist: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.wbmp',
      '.webp',
      '.tif',
      '.psd',
      '.svg',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.less',
      '.html',
      '.htm',
      '.xml',
      '.pdf',
      '.zip',
      '.gz',
      '.tgz',
      '.gzip',
      '.mp3',
      '.mp4',
      '.avi',
      '.map',
    ],
  },
} as MidwayConfig
