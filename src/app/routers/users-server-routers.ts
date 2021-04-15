import { DefaultState, Context } from 'koa'
import * as Router from 'koa-router'
import usersControllers from '../controllers/users-server-controllers'

const router = new Router<DefaultState, Context>({'prefix': '/api'})

router.post('/adduser', async (ctx, next) => {
  await usersControllers.add(ctx, next)
})

router.get('/verificationuser', async (ctx, next) => {
  await usersControllers.verification(ctx, next)
})

router.post('/login', async (ctx, next) => {
  await usersControllers.login(ctx, next)
})

export default router
