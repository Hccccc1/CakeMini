const getUserInfo = require('./getUserInfo/index')
const userRegister = require('./registerUser/index')
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getUserInfo':
      return await getUserInfo.main(event, context);
    case 'userRegister':
      return await userRegister.main(event, context);
  }
}