// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('版本过低')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }
  }
})