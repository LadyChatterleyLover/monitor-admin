import { prop } from '@typegoose/typegoose'
import mongoose from 'mongoose'

export class File {
  @prop()
  public name: string

  @prop()
  public ext?: string

  @prop({ ref: mongoose.Schema.Types.ObjectId })
  public user_id: string

  @prop()
  public size?: string

  @prop()
  public url?: string

  @prop({ default: Date.now() })
  public created_time?: string

  @prop({ select: false })
  public __v: number
}
