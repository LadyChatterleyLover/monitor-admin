import { prop } from '@typegoose/typegoose';

export class Report {
  @prop()
  public appKey: string;

  @prop({ allowMixed: 0 })
  public breadcrumb: any[];

  @prop({ allowMixed: 0 })
  public deviceInfo: any;

  @prop()
  public column?: string;

  @prop()
  public fileName?: string;

  @prop()
  public line?: string;

  @prop()
  public message?: string;

  @prop()
  public page_url?: string;

  @prop()
  public recordScreenId?: string;

  @prop()
  public roleName?: string;

  @prop()
  public sdkName?: string;

  @prop()
  public sdkVersion?: string;

  @prop()
  public status?: string;

  @prop()
  public time?: number;

  @prop()
  public trackerId?: string;

  @prop()
  public type?: string;

  @prop()
  public username?: string;

  @prop()
  public uuid?: string;

  @prop({select: false})
  public __v: number;
}
