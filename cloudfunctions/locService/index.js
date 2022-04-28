// 云函数入口文件
const getLocInfo = require('./getLocInfo/index')
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getLocInfo':
      return await getLocInfo.main(event, context)
  }
}