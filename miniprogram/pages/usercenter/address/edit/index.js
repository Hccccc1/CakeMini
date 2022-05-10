import Toast from 'tdesign-miniprogram/toast/index';
// import { fetchDeliveryAddress } from '../../../../services/address/fetchAddress';
import {
  areaData
} from '../../../../config/index';
import {
  resolveAddress,
  rejectAddress
} from './util';
import {
  addressParse
} from '../../../../utils/addressParse';

const innerPhoneReg =
  '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
const innerNameReg = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$';
const labelsOptions = [{
    id: 0,
    name: '家'
  },
  {
    id: 1,
    name: '公司'
  },
];

Page({
  options: {
    multipleSlots: true,
  },
  externalClasses: ['theme-wrapper-class'],
  data: {
    locationState: {
      labelIndex: null,
      addressId: '',
      addressTag: '',
      cityCode: '',
      cityName: '',
      countryCode: '',
      countryName: '',
      detailAddress: '',
      districtCode: '',
      districtName: '',
      isDefault: false,
      name: '',
      phone: '',
      provinceCode: '',
      provinceName: '',
      isEdit: false,
      isOrderDetail: false,
      isOrderSure: false,
    },
    areaData: areaData,
    labels: labelsOptions,
    areaPickerVisible: false,
    submitActive: false,
    visible: false,
    labelValue: '',
    columns: 3,
  },
  privateData: {
    verifyTips: '',
  },
  onLoad(options) {
    const {
      id
    } = options;
    this.init(id);
  },
  onUnload() {
    if (!this.hasSava) {
      rejectAddress();
    }
  },
  hasSava: false,
  init(id) {
    if (id) {
      this.getAddressDetail(Number(id));
    }
  },
  getAddressDetail(id) {
    //TODO: 获取收货地址
    /*
    fetchDeliveryAddress(id).then((detail) => {
      this.setData({
        locationState: detail
      }, () => {
        const {
          isLegal,
          tips
        } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
        });
        this.privateData.verifyTips = tips;
      });
    });
    */
  },
  onInputValue(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const {
      value = '', areas = []
    } = e.detail;
    if (item === 'address') {
      this.setData({
          'locationState.provinceCode': areas[0].code,
          'locationState.provinceName': areas[0].name,
          'locationState.cityName': areas[1].name,
          'locationState.cityCode': areas[1].code,
          'locationState.districtCode': areas[2].code,
          'locationState.districtName': areas[2].name,
          areaPickerVisible: false,
        },
        () => {
          const {
            isLegal,
            tips
          } = this.onVerifyInputLegal();
          this.setData({
            submitActive: isLegal,
          });
          this.privateData.verifyTips = tips;
        },
      );
    } else {
      this.setData({
          [`locationState.${item}`]: value,
        },
        () => {
          const {
            isLegal,
            tips
          } = this.onVerifyInputLegal();
          this.setData({
            submitActive: isLegal,
          });
          this.privateData.verifyTips = tips;
        },
      );
    }
  },
  onPickArea() {
    this.setData({
      areaPickerVisible: true
    });
  },
  onPickLabels(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const {
      locationState: {
        labelIndex = undefined
      },
      labels = [],
    } = this.data;
    let payload = {
      labelIndex: item,
      addressTag: labels[item].name,
    };
    if (item === labelIndex) {
      payload = {
        labelIndex: null,
        addressTag: ''
      };
    }
    this.setData({
      'locationState.labelIndex': payload.labelIndex,
    });
    this.triggerEvent('triggerUpdateValue', payload);
  },
  addLabels() {
    this.setData({
      visible: true,
    });
  },
  confirmHandle() {
    const {
      labels,
      labelValue
    } = this.data;
    this.setData({
      visible: false,
      labels: [
        ...labels,
        {
          id: labels[labels.length - 1].id + 1,
          name: labelValue
        },
      ],
      labelValue: '',
    });
  },
  cancelHandle() {
    this.setData({
      visible: false,
      labelValue: '',
    });
  },
  onCheckDefaultAddress({
    detail
  }) {
    const {
      value
    } = detail;
    this.setData({
      'locationState.isDefault': value,
    });
  },

  onVerifyInputLegal() {
    const {
      name,
      phone,
      detailAddress,
      districtName
    } =
    this.data.locationState;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const prefixNameReg = String(this.properties.nameReg || innerNameReg);
    const nameRegExp = new RegExp(prefixNameReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);

    if (!name || !name.trim()) {
      return {
        isLegal: false,
        tips: '请填写收货人',
      };
    }
    if (!nameRegExp.test(name)) {
      return {
        isLegal: false,
        tips: '收货人仅支持输入中文、英文（区分大小写）、数字',
      };
    }
    if (!phone || !phone.trim()) {
      return {
        isLegal: false,
        tips: '请填写手机号',
      };
    }
    if (!phoneRegExp.test(phone)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }
    if (!districtName || !districtName.trim()) {
      return {
        isLegal: false,
        tips: '请选择省市区信息',
      };
    }
    if (!detailAddress || !detailAddress.trim()) {
      return {
        isLegal: false,
        tips: '请完善详细地址',
      };
    }
    if (detailAddress && detailAddress.trim().length > 50) {
      return {
        isLegal: false,
        tips: '详细地址不能超过50个字符',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },

  builtInSearch({
    code,
    name
  }) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting[code] === false) {
            wx.showModal({
              title: `获取${name}失败`,
              content: `获取${name}失败，请在【右上角】-小程序【设置】项中，将【${name}】开启。`,
              confirmText: '去设置',
              confirmColor: '#FA550F',
              cancelColor: '取消',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(settinRes) {
                      if (settinRes.authSetting[code] === true) {
                        resolve();
                      } else {
                        console.warn('用户未打开权限', name, code);
                        reject();
                      }
                    },
                  });
                } else {
                  reject();
                }
              },
              fail() {
                reject();
              },
            });
          } else {
            resolve();
          }
        },
        fail() {
          reject();
        },
      });
    });
  },

  locFromGeo: function (_latitude, _longitude) {
    return new Promise(async (resolve, reject) => {
      await wx.cloud.callFunction({
        name: 'locService',
        data: {
          type: 'getLocInfo',
          latitude: _latitude,
          longitude: _longitude
        }
      }).then(resp => {
        resolve(resp)
      }).catch(e => {
        reject(e)
      })
    })
  },

  onSearchAddress() {
    this.builtInSearch({
      code: 'scope.userLocation',
      name: '地址位置'
    }).then(
      () => {
        wx.chooseLocation({
          success: async (res) => {
            if (res.name) {
              // this.triggerEvent('addressParse', {
              //   address: res.address,
              //   name: res.name,
              //   latitude: res.latitude,
              //   longitude: res.longitude,
              // });
              this.locFromGeo(res.latitude, res.longitude).then(async res => {
                const locResult = JSON.parse(res.result);
                const ad_info = locResult.result.ad_info;
                const formatted_addr = locResult.result.formatted_addresses;

                const target = {
                  countryName: '中国',
                  countryCode: 'chn',
                  provinceName: ad_info.province,
                  cityName: ad_info.city,
                  districtName: ad_info.district,
                  detailAddress: formatted_addr.recommend,
                };

                try {
                  const {
                    provinceCode,
                    cityCode,
                    districtCode
                  } =
                  await addressParse(target.provinceName, target.cityName, target.districtName);

                  const params = Object.assign(target, {
                    provinceCode,
                    cityCode,
                    districtCode
                  });

                  console.log('before locateState', this.data.locationState)

                  const {
                    locationState
                  } = this.data;
                  const wxAddress = params;

                  this.setData({
                    locationState: {
                      ...locationState,
                      ...wxAddress
                    }
                  });

                  console.log('locateState', this.data.locationState)
                } catch (e) {
                  console.error('地址解析错误', e)
                }
              }).catch(e => {
                console.error(e)
              })
            } else {
              Toast({
                context: this,
                selector: '#t-toast',
                message: '地点为空，请重新选择',
                icon: '',
                duration: 1000,
              });
            }
          },
          fail: function (res) {
            console.warn(`wx.chooseLocation fail: ${JSON.stringify(res)}`);
            if (res.errMsg !== 'chooseLocation:fail cancel') {
              Toast({
                context: this,
                selector: '#t-toast',
                message: '地点错误，请重新选择',
                icon: '',
                duration: 1000,
              });
            }
          },
        });
      },
    );
  },
  formSubmit: async function () {
    const {
      submitActive
    } = this.data;
    if (!submitActive) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: this.privateData.verifyTips,
        icon: '',
        duration: 1000,
      });
      return;
    }
    const {
      locationState
    } = this.data;

    this.hasSava = true;

    const db = wx.cloud.database();
    const openid = getApp().openID;

    const record = await db.collection('users').where({
      _openid: openid
    }).get();

    const user = record.data[0];
    let userAddresses = user.userAddresses;
    var id = userAddresses.length + 1;

    userAddresses.push({
      name: locationState.name,
      phone: locationState.phone,
      provinceName: locationState.provinceName,
      provinceCode: locationState.provinceCode,
      cityName: locationState.cityName,
      cityCode: locationState.cityCode,
      districtName: locationState.districtName,
      districtCode: locationState.districtCode,
      detailAddress: locationState.detailAddress,
      addressTag: locationState.addressTag,
      addressId: id
    });

    db.collection('users').where({
      _openid: openid
    }).update({
      data: {
        userAddresses: userAddresses
      },
      success: () => {
        console.log('succeed in add')
        getApp().globalData.isLogin = true;
      }
    })
    /*
        resolveAddress({
          saasId: '88888888',
          uid: `88888888205500`,
          authToken: null,
          id: locationState.addressId,
          addressId: locationState.addressId,
          phone: locationState.phone,
          name: locationState.name,
          countryName: locationState.countryName,
          countryCode: locationState.countryCode,
          provinceName: locationState.provinceName,
          provinceCode: locationState.provinceCode,
          cityName: locationState.cityName,
          cityCode: locationState.cityCode,
          districtName: locationState.districtName,
          districtCode: locationState.districtCode,
          detailAddress: locationState.detailAddress,
          isDefault: locationState.isDefault === 1 ? 1 : 0,
          addressTag: locationState.addressTag,
          latitude: locationState.latitude,
          longitude: locationState.longitude,
          storeId: null,
        });
    */

    wx.navigateBack({
      delta: 1
    });
  },

  getWeixinAddress(e) {
    const {
      locationState
    } = this.data;
    const weixinAddress = e.detail;
    this.setData({
        locationState: {
          ...locationState,
          ...weixinAddress
        },
      },
      () => {
        const {
          isLegal,
          tips
        } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
        });
        this.privateData.verifyTips = tips;
      },
    );
  },
});