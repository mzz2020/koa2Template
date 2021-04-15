import { ParameterizedContext, DefaultState, Context, Next } from 'koa'
import { SendProp } from '../utils'

declare module 'koa' {
  export interface DefaultContext {
    send: (json: SendProp | string, isErro?: boolean) => void;
  }
}

function setSend (json: SendProp | string, isError = false)  {
  this.set('content-type', 'application/json')
  if (isError) {
    const newJson = json as SendProp

    const code = newJson.code || 500
    this.status = code

    this.body = JSON.stringify({
      status: false,
      code,
      message: newJson.message
    })
  } else {
    this.body = JSON.stringify(json)
  }
}

export function koaSend() {
  return async (ctx: ParameterizedContext<DefaultState, Context>, next: Next) => {
    ctx.send = setSend.bind(ctx)
    await next()
  }
}
