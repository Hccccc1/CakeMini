Page({
  data: {},

  /** 选择模式 */
  selectMode: false,
  /** 是否已经选择地址，不置为true的话页面离开时会触发取消选择行为 */
  hasSelect: false,

  onLoad() {
    this.init();
  },

  init() {
    this.getAddressList();
    console.log('init')
  },

  fetchAddressesFromCloud: function () {
    return new Promise((resolve, reject) => {
      wx.cloud.database().collection('users').where({
        _openid: getApp().globalData.openid
      }).get().then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getAddressList: async function () {
    //TODO: 获取收获地址
    let userAddress;
    await this.fetchAddressesFromCloud().then(res => {
      userAddress = res.data[0].userAddresses;
    }).catch(e => {
      console.error(e)
    });
    console.log('userAddress', userAddress);

    this.setData({
      addressList: userAddress
    })

    // fetchDeliveryAddressList().then((addressList) => {
    //   addressList.forEach((address) => {
    //     if (address.id === id) {
    //       address.checked = true;
    //     }
    //   });
    //   this.setData({ addressList });
    // });
  },
});