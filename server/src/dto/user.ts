import { Rule, RuleType } from '@midwayjs/validate'

export class UserDTO {
  @Rule(
    RuleType.string()
      .required()
      .error(new Error('用户名不能为空'))
      .min(2)
      .max(6)
      .error(new Error('用户名在2-6位之间'))
  )
  username: string

  @Rule(RuleType.string().min(6).max(15).error(new Error('密码不能为空')))
  password: string

  @Rule(RuleType.string().required().error(new Error('验证码id不能为空')))
  id: string

  @Rule(RuleType.string().required().error(new Error('验证码不能为空')))
  answer: string
}
