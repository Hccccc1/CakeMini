const {
  resp
} = require('pages/order/after-service-list/api');
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    const _ = cloud.openapi({
      convertBase: false
    }).serviceMarket.invokeService({
      "service": 'wxc1c68623b7bdea7b',
      "api": 'rgeoc',
      "data": {
        'location': event.latitude + ',' + event.longitude
      },
      "client_msg_id": "id123"
    })

    if (!_.status) {
      return _.result;
    } else {
      return {
        status: _.status
      }
    }
  } catch (e) {
    return e;
  }
}