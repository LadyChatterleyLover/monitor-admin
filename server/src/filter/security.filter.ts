import { UnauthorizedError } from '@midwayjs/core/dist/error/http'
import { Catch } from '@midwayjs/decorator'

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter {
  async catch(err: Error) {
    return {
      code: 401,
      message: err.message,
    }
  }
}
