const config=require('/utils/config.js');
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    this.checkInternet()
    var that=this
    wx.login({
      success:(res)=>{
        config.ajax('POST',{
          wxcode: res.code
        }, config.wxLogin,(res)=>{
          that.globalData.openid = res.data.data.openId
          config.ajax('POST', {
            openId: res.data.data.openId
          }, config.isSubscibe, (res) => {
            that.globalData.isSubscibe = res.data.data
          }, (res) => {

          })
        },(res)=>{

        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  checkInternet() {
    try {
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType != 'wifi') {
            wx.showToast({
              title: '您当前的网络的状态为' + res.networkType + '网络!请注意您的流量费用',
              icon: 'none',
              mask: true,
            })
          }
        }
      })
    }
    catch (err) {

    }
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  globalData: {
   openid:null,
   isSubscibe:false
  },
})
