// pages/usercenter/index.js
const app = getApp();

const menuData = [
  [{
      title: '收货地址',
      tit: '',
      url: '',
      type: 'address',
    },
    {
      title: '优惠券',
      tit: '',
      url: '',
      type: 'coupon',
    },
    {
      title: '积分',
      tit: '',
      url: '',
      type: 'point',
    },
  ],
  [{
      title: '帮助中心',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
];
const orderTagInfos = [{
    title: '待付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 5,
    status: 1,
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 10,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 40,
    status: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 60,
    status: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1,
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    menuData: menuData,
    orderTagInfos: orderTagInfos
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

  getUserProfile: async function () {
    var user = null;

    await wx.getUserProfile({
      desc: 'GetUserProfile',
    }).then(userProfile => {
      user = userProfile.userInfo;
    }).catch(() => {
      console.error('user cancelled');
    })

    return user;
  },

  // true: 已经注册并返回信息
  // false: 未注册
  checkIfRegistered: async function () {
    var isRegistered = false;

    await wx.cloud.callFunction({
      name: 'userService',
      data: {
        type: 'getUserInfo'
      }
    }).then(resp => {
      app.globalData.globalOpenid = resp.result.openID;

      if (resp.result.user.data.length === 1) {
        isRegistered = true;
      }
    })

    return isRegistered;
  },

  register2Cloud: async function (user) {
    console.log('register', user);
    wx.cloud.callFunction({
      name: 'userService',
      data: {
        type: 'userRegister',
        avatarUrl: user.avatarUrl,
        nickName: user.nickName,
        addresses: []
      },
      success: () => {
        wx.navigateTo({
          url: './userRegister/index?avatarUrl=' + user.avatarUrl + '&nickName=' + user.nickName,
        });
      },
      fail: () => {
        wx.navigateBack();
      }
    });
  },

  gotoUserEditPage: async function () {
    if (this.data.isLogin) {
      console.log('don\'t need login');
    } else {
      const user = await this.getUserProfile();
      const isRegistered = await this.checkIfRegistered();

      if (user != null) {
        if (isRegistered) {
          this.setData({
            'userInfo.nickName': user.nickName,
            'userInfo.avatarUrl': user.avatarUrl,
            isLogin: true
          })
        } else {
          wx.showModal({
            content: 'register now?',
          }).then(res => {
            if (res.confirm) {
              console.log('用户点击确定')
              this.register2Cloud(user);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          })
        }
      }
    }
  }
})