// pages/usercenter/userRegister/index.js
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: '男',
    avatarUrl: '',
    nickName: '',
    phoneNumber: '',

    pickerOptions: [{
        name: '男',
        code: '1',
      },
      {
        name: '女',
        code: '2',
      },
    ],
    genderEditVisible: false,
    genderMap: ['', '男', '女'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      avatarUrl: options.avatarUrl,
      nickName: options.nickName
    })
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

  onClickCell({
    currentTarget
  }) {
    const {
      dataset
    } = currentTarget;
    const {
      nickName
    } = this.data;

    console.log('dataset', dataset);

    switch (dataset.type) {
      case 'avatarUrl':
        break;
      case 'name':
        wx.navigateTo({
          url: `../name-edit/index?name=${nickName}`,
        });
        break;
      case 'gender':
        console.log('show gender edit')
        this.setData({
          genderEditVisible: true,
        });
        break;
      case 'phoneNumber':
        break;

      default:
        break;
    }
  },

  onConfirm(e) {
    const {
      value
    } = e.detail;

    this.setData({
      genderEditVisible: false,
      'gender': value,
    });
  },
  onClose() {
    this.setData({
      genderEditVisible: false,
    });
  }
})