// import { createSchema, Type } from 'ts-mongoose'
import * as mongoose from 'mongoose'
import { UserSchemaProps } from '../../utils'

const region = new mongoose.Schema({
  code: Number,
  name: String
}, {
  _id: false
})

const userSchema = new mongoose.Schema<UserSchemaProps>({
  type: String, // 登陆类型 wechat mobile user
  account: String, // 平台帐号
  wechat: String, // 微信号
  imageUrl: String, // 头像路径
  mobilePhone: String, // 手机号
  password: String, // 密码
  verificationCode: Number, // 验证码
  nickName: String, // 昵称
  sex: Number, // 性别
  region: { // 地区
    type: [region],
    default: []
  },
  birthday: String, // 出生日期
  signature: String,  // 签名
  realNameAuthentication: String, // 实名认证
  createTime: { // 创建时间
    type: Date,
    default: Date.now
  },
  updateTime: { // 更新时间
    type: Date,
    default: Date.now
  }
}, {
  collection: 'users',
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  }
})

// 建立索引 1 升序索引 -1 降序索引
userSchema.index({
  type: 1,
  mobilePhone: 1,
  password: 1,
  account: 1
})

export default userSchema
