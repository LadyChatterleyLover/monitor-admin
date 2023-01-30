import { prop } from '@typegoose/typegoose'

export class User {
  @prop()
  public username: string

  @prop()
  public password: string

  @prop({ default: Date.now })
  public createTime: string

  @prop({ select: false })
  public __v: number
}
