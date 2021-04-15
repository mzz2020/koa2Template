/*
* 定义服务端配置
* 开发环境 development
* 生产环境 production 需配置NODE_ENV="production" 环境变量
*/

const development = {
  port: 3000,
  db: {
    user: 'admin',
    pwd: 'admin',
    host: '127.0.0.1',
    port: 4444,
    dataBase: 'mzz',
    key: 'A3CC734DEFGD4CS6',
    iv: '1248648315412586'
  },
  debug: {
    isProd: false
  },
  dateOut: 7
}

module.exports = development
