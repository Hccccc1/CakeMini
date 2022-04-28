const {
  rejectAddress
} = require("../address/list/util");

// pages/usercenter/loginRegister/index.js
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

  loginWithWechat: async function () {
    const user = await wx.getUserProfile({
      desc: '获取用户信息用于登录或注册',
    }).then(userProfile => {
      return userProfile;
    }).catch((e) => {
      // wx.navigateBack();
      return e;
    });

    if (user.errMsg != 'getUserProfile:ok') {
      wx.navigateBack();
    } else {
      await wx.cloud.callFunction({
        name: 'userService',
        data: {
          type: 'getUserInfo'
        }
      }).then(resp => {
        console.log('res', resp)

        if (resp.result.data.length === 1) {
          // 用户存在无需注册
        } else {
          // 提示用户注册
          wx.showModal({
            title: 'tips',
            content: 'register?',
            success: res => {
              if (res.confirm) {
                console.log();

                wx.navigateTo({
                  url: '/pages/usercenter/address/edit/index',
                })
              } else if (res.cancel) {
                wx.navigateBack();
              } else
                console.error('unknown state');
            }
          })
        }
      }).catch(e => {
        console.error(e);
      })
    }
  }
})