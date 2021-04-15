import app from './app'
import * as http from 'http'
import * as socket from 'socket.io'
import config from './configs'
import Debugger from './utils/useDebugger'

const debug = Debugger()
const debugSt = Debugger('socket')

// 定义方法
const normalizePort = (val: string): number => {
  const getPort = parseInt(val, 10)
  return isNaN(getPort) ? 3000 : getPort
}

const port = normalizePort(config.port || 3000)
const server = http.createServer(app.callback())
const io = new socket.Server(server)

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `Pipe ${addr}` : `server is runing Port ${addr.port}`
  debug.log(bind)
}

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
      throw error
  }

  const bind = typeof port === 'string' ? `Pipe${port}` : `Port${port}`

  switch (error.code) {
    case 'EACCES':
      debug.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      debug.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

// 监听用户连接
io.on('connection', st => {
  debugSt.log('初始化 Socket 成功')
  io.emit('action', 'connection')
  st.on('server', data => {
    debugSt.log(`${data.sender} 向 ${data.receiver} 发起了对话`)
    io.emit(data.receiver, data)
  })
  // 监听用户断开连接
  st.on('disconnect', (data: any) => {
    debugSt.log(`${data}，离开了`)
  })
})

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

export default server
