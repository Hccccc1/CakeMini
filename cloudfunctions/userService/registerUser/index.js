const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  var avatar = event.avatarUrl
  var nickName = event.nickName

  return await db.collection('users').add({
    data: {
      _openid: wxContext.OPENID,
      userAvatar: avatar,
      userNickName: nickName
    }
  }).then(res => {
    return {
      result: res,
      data: 'ok'
    }
  }).catch(e => {
    return {
      data: 'fail -> ' + e
    }
  })
}