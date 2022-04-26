// pages/usercenter/logRegister/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getUserProfileAndRegister: async function () {
    wx.getUserProfile({
      desc: '获取用户信息用于注册',
      success: res => {
        // console.log(res)

        wx.cloud.callFunction({
          name: 'userService',
          data: {
            type: 'userRegister',
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
          }
        }).then(res => {
          console.log(res)
        }).catch(e => {
          console.error(e)
        });
      },
    })
  },

  loginWithWechat: async function () {

    await wx.getUserProfile({
      desc: 'get user profile',
    }).then(res => {

      wx.cloud.callFunction({
        name: 'userService',
        data: {
          type: 'getUserInfo'
        }
      }).then(resp => {
        if (resp.result.data.length === 1) {
          console.log('user in database')
        } else {
          console.log('no user ' + resp.result.data.length)

          wx.showModal({
            title: 'tips',
            content: 'register now ?',
            success: permission => {
              if (permission.confirm) {
                console.log('register now')

                var jumpUrl = '/pages/usercenter/logRegister/userRegister/index?avatarUrl=' +
                  res.userInfo.avatarUrl +
                  '&nickName=' +
                  res.userInfo.nickName;

                console.log(jumpUrl)

                wx.navigateTo({
                  url: jumpUrl,
                  events: {
                    sendUserInfo: function (data) {
                      console.log('data -> ' + data)
                    }
                  },
                  // success: function (res) {
                  //   res.eventChannel.emit('recvUserInfo', {
                  //     data: userInfo
                  //   })
                  // }
                })
              } else if (permission.cancel) {
                console.log('canceled')
              }
            }
          })
        }
      })
    })

    /*
        await wx.cloud.callFunction({
          name: 'userService',
          data: {
            type: 'getUserInfo'
          }
        }).then(resp => {
          console.log(resp);

          if (resp.result.data.length === 1) {
            // 数据库有记录，直接获取数据并登录
            console.log(resp.result);
          } else {
            // 数据库无记录，提示注册
            wx.showModal({
              title: '提示',
              content: '是否授权微信登录',
              success: res => {
                if (res.confirm && !res.cancel) {
                  console.log('register now')
                  wx.navigateTo({
                    url: '/pages/usercenter/logRegister/userRegister/index',
                  })
                  // this.getUserProfileAndRegister();
                } else if (!res.confirm && res.cancel) {
                  wx.navigateBack();
                } else {
                  console.error('unknown state')
                }
              },
              fail: e => {
                console.error(e)
              }
            })
          }
        }).catch(e => {
          console.error(e)
        })
        */
  }
})