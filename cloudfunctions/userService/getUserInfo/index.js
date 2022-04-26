const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  return await db.collection('users').where({
    _openid: wxContext.OPENID
  }).get().catch(e => {
    return {
      result: e,
      data: 'failed'
    }
  })

  return {
    data: 'nothing found'
  }

  // return {
  //   data: db.collection('users').where({
  //     _openid: wxContext.OPENID
  //   }).get()
  // }
}