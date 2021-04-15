// 获取系统变量 NODE_ENV
const env = process.env.NODE_ENV

// 分辨环境变量获取当对配置文件
const configjs = env === 'production' ? require(`./env/${env}`) : require('./env/development')

export default configjs
