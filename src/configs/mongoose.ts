import * as mongoose from 'mongoose'
import config from '../configs'
import Debugger from '../utils/useDebugger'
const debug = Debugger('DB')

const { user, pwd, host, port, dataBase } = config.db
const dbUrl = `mongodb:\/\/${user}:${pwd}@${host}:${port}\/${dataBase}`

const dbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true
}

const createDB = (url?: string) => {
  const newUrl = url || dbUrl
  const db = mongoose.createConnection(newUrl, dbOptions)

  db.on('connected', () => {
    debug.log(`${dataBase} connection is success, port ${port}`)
  })

  db.on('error', (err) => {
    debug.error(`mongodb connection error: ${err}`)
  })

  db.on('disconnected', () => {
    debug.warn('mongodb connection disconnected')
  })

  return db
}

export default createDB
