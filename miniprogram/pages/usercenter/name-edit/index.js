Page({
  data: {
    nameValue: '',
  },
  onLoad(options) {
    const {
      name
    } = options;
    this.setData({
      nameValue: name,
    });
  },
  onSubmit() {
    wx.navigateBack({
      backRefresh: true
    });

    const pages = getCurrentPages();
    const lastPage = pages[pages.length - 2];
    console.log('lastPage', lastPage);
    lastPage.setData({
      nickName: this.data.nameValue
    })
  },
  clearContent() {
    this.setData({
      nameValue: '',
    });
  },
});