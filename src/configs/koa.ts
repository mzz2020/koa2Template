import * as Koa from 'koa'
import * as path from 'path'
import * as json from 'koa-json'
import * as logger from 'koa-logger'
import * as bodyparser from 'koa-bodyparser'
import * as status from 'koa-static'
import * as cors from 'koa2-cors'
import { koaSend } from './koa-send'
import Debugger from '../utils/useDebugger'

// routers
import usersRouter from '../app/routers/users-server-routers'

// const onError = require('koa-onerror')
const debug = Debugger('info')

const createApp = () => {

  const app = new Koa()
  // 跨域
  app.use(cors())
  app.use(json())
  app.use(logger())
  app.use(koaSend())
  // 抛出错误
  // onError(app)
  // 静态目录
  app.use(status(path.join(__dirname, '..', 'opt')))

  // 处理POST 请求 router 必须放这下面
  app.use(bodyparser())

  app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    debug.log('%s %s - %sms', ctx.method, ctx.url, ms)
  })

  // 注册路由中间件
  app.use(usersRouter.routes()).use(usersRouter.allowedMethods())

  // 错误处理
  app.on('error', (err, ctx) => {
    debug.error('server error', err, ctx);
  })

  return app
}

export default createApp
