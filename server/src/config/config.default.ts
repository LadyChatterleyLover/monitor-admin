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
} as MidwayConfig
