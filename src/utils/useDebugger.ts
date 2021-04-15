import { Debugger } from 'ts-debug'
import * as moment from 'moment'
import configs from '../configs'
const { isProd } = configs

export default (name: string = 'system') => {
  return new Debugger(console, !isProd, `[${name}] [${moment(Date.now()).format('YY-MM-DD hh:mm:ss')}] `)
}
