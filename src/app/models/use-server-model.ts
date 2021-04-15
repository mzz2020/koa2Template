import createDB from '../../configs/mongoose'
import userSchema from '../schemas/user-server-schems'

// createDB 不传参数 默认连接 mzz库
const db = createDB()
const userModel = db.model('users', userSchema)

export { userModel }
