import * as cryptojs from 'crypto-js'
import { userModel } from '../app/models/use-server-model'
import config from '../configs'
import { SendProp, MessageCodeProp, ObjectAnyProp, UserJsonProps } from '../utils'

// 是否为JSONStr
const strToJson = (str: string) => {
  try {
    return JSON.parse(str)
  } catch {
    return str
  }
}

const { key, iv } = config.db
// 获取 key
const getKey = () => cryptojs.enc.Utf8.parse(key)
// 获取 iv
const getIv = () => cryptojs.enc.Utf16.parse(iv)
// 加密码
export const aesString = async (result: ObjectAnyProp<any> | string) => {
 const json = JSON.stringify(result)
 const data = cryptojs.enc.Utf8.parse(json)
 const encrypted = cryptojs.AES.encrypt(data, getKey(), {
   iv: getIv(),
   mode: cryptojs.mode.CBC,
   padding: cryptojs.pad.Pkcs7
 })
 return encrypted.ciphertext.toString().toUpperCase()
}

// 解密
export const daesString = async (result: string) => {
  const encrypted = cryptojs.enc.Hex.parse(result)
  const encryptedBase64 = cryptojs.enc.Base64.stringify(encrypted)
  const decrypted = cryptojs.AES.decrypt(encryptedBase64, getKey(), {
    iv: getIv(),
    mode: cryptojs.mode.CBC,
    padding: cryptojs.pad.Pkcs7
  }).toString(cryptojs.enc.Utf8)

  return strToJson(decrypted)
}

const getMessage = (code: number): string => {
  const messageDate: MessageCodeProp = {
    401: '权限不够',
    403: '用户不存在或密码错误',
    405: '用户已存在',
    406: '参数错误'
  }
  return messageDate[code] || ''
}

export const getSend = async (code: number, params: SendProp = { code: 404, status: false}) => {
  const newparams: SendProp = {
    ...params,
    code,
    status: !!(code === 200)
  }

  const msg = getMessage(code)
  if (msg && !params.message) {
    newparams.message = msg
  }

  return await newparams
}

// 获取过期时间
export const getDateOut = (days?: number) => {
  const day = days || config.dateOut || 7
  return day * 24 * 60 * 60 * 1000
}

// 生成一个随机数
export const randomNumber = (n: number = 4) => {
  return Math.random().toString(36).substr(2).slice(0, n)
}

// 生成一个平台帐号 account
export const generateAccount = () => {
  return randomNumber() + randomNumber() + '-' + new Date().getFullYear()
}

// 校验用户是否存在，类型
export const verificationUser = async (token: string) => {
  const tokenJson: UserJsonProps = await daesString(token)
  const { mobilePhone, password, time, timeOut} = tokenJson
  if (time && timeOut) {
    if (new Date().getTime() - time >= timeOut - time) {
      return ''
    } else {
      try {
        return await userModel.findOne({ mobilePhone, password })
      } catch (error) {
        return ''
      }
    }
  } else {
    return ''
  }
}

// 加密转token
export const getToken = async (_id: string, mobilePhone: string, password: string) => {
  const date = new Date()
  return await aesString({
    _id,
    mobilePhone,
    password,
    time: date.getTime(),
    timeOut: date.getTime() + getDateOut()
  })
}
