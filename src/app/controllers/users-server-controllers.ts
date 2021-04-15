import { userModel } from '../models/use-server-model'
import { getSend, generateAccount, aesString, getToken, verificationUser } from '../../utils/useCommon'
import { ControllersProp } from '../../utils'

const usersControllers: ControllersProp = {}
usersControllers.add = async ctx => {
  const { body } = ctx.request
  const { type, mobilePhone, password } = body
  if (type) {
    if (type === 'user') {
      if (mobilePhone && password) {
        const encryptPwd = await aesString(password)
        try {
          const user = await userModel.findOne({ mobilePhone, type })
          if (user) {
            ctx.send(await getSend(405))
          } else {
            body.account = await generateAccount()
            body.password = encryptPwd
            const nBody = new userModel(body)
            const doc = await nBody.save()
            const token = await getToken(doc._id, doc.mobilePhone, doc.password)
            const result = doc.toObject()
            delete result.password
            ctx.send(await getSend(200, {
              message: '注册成功',
              token,
              result
            }))
          }
        } catch (error) {
          ctx.send(error, true)
        }
      } else {
        ctx.send(await getSend(406))
      }
    }
  } else {
    ctx.send(await getSend(406))
  }
}
usersControllers.verification = async ctx => {
  const { token } = ctx.request.headers
  const user = await verificationUser(token as string)
  if (user) {
    const result = user.toObject()
    delete result.password
    ctx.send(await getSend(200, { result }))
  } else {
    ctx.send(await getSend(401))
  }
}

usersControllers.login = async ctx => {
  const { body } = ctx.request
  const { type, mobilePhone, password } = body
  if (type === 'user' && mobilePhone && password) {
    const encryptPwd = await aesString(password)
    try {
      const user = await userModel.findOne({ type, mobilePhone, password: encryptPwd })
      if (user) {
        const token = await getToken(user._id, user.mobilePhone, user.password)
        const result = user.toObject()
        delete result.password
        ctx.send(await getSend(200, {
          message: '登陆成功',
          token,
          result
        }))
      } else {
        ctx.send(await getSend(403))
      }
    } catch (error) {
      ctx.send(error, true)
    }
  } else {
    ctx.send(await getSend(406))
  }
}

export default usersControllers
