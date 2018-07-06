// pages/index/index.js
var app = getApp();
var page=1;
const config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: false,
    hotWord:[],
    videoList: [],
    playIndex: null,
    mask:false,
    isSubscibe:true,
    page:'index',
    moretype: '上拉查看更多哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.login({
      success: (res) => {
        config.ajax('POST', {
          wxcode: res.code
        }, config.wxLogin, (res) => {
          app.globalData.openid = res.data.data.openId
          config.ajax('POST', {
            openId: res.data.data.openId
          }, config.isSubscibe, (res) => {
            that.setData({
              isSubscibe: res.data.data
            })
            app.globalData.isSubscibe = res.data.data
          }, (res) => {

          })
        }, (res) => {

        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    page = 1;
    wx.showLoading({
      title:'数据加载中...',
      mask: true,
    })
    this.videoGroup = this.selectComponent("#videoGroup");
    // this.getlistHot()
    this.getvideoList()
    this.getHotword()
    this.getAps()
  },
  /**
   * 获取热词
   */
  getHotword() {
    var params = {}
    config.ajax('POST', params, config.hotWord, (res) => {
      console.log(res.data.data[16])
      for (var i = 0; i < res.data.data.length; i++) {
        if ((i + 4) % 4 == 0) {
          if (res.data.data[i]!=undefined){
            res.data.data[i].bgsrc = 'http://www.kiss-me.top/video/a.png';
            res.data.data[i].Bgsrc = 'http://www.kiss-me.top/video/aa.png';
            res.data.data[i].ph = 'http://www.kiss-me.top/video/1.png';
          }
          if (res.data.data[i+1] != undefined){
            res.data.data[i + 1].bgsrc = 'http://www.kiss-me.top/video/b.png';
            res.data.data[i + 1].Bgsrc = 'http://www.kiss-me.top/video/bb.png';
            res.data.data[i + 1].ph = 'http://www.kiss-me.top/video/2.png';
          }
          if (res.data.data[i + 2] != undefined){
            res.data.data[i + 2].bgsrc = 'http://www.kiss-me.top/video/c.png';
            res.data.data[i + 2].Bgsrc = 'http://www.kiss-me.top/video/cc.png';
            res.data.data[i + 2].ph = 'http://www.kiss-me.top/video/3.png';
          }
          if (res.data.data[i + 3]!=undefined){
            res.data.data[i + 3].bgsrc = 'http://www.kiss-me.top/video/d.png';
            res.data.data[i + 3].Bgsrc = 'http://www.kiss-me.top/video/dd.png';
            res.data.data[i + 3].ph = 'http://www.kiss-me.top/video/4.png';
          }
        }
        if (i > 3) {
          res.data.data[i].ph = 'http://www.kiss-me.top/video/4.png';
        }
      }
      console.log(res.data.data)
      this.setData({
        hotWord:res.data.data
      })
      
    }, (res) => {

    })
  },
  /**
 * 获取视频列表
 */
  getvideoList(art) {
    if (art == undefined || art == null || art == '') {
      var hotWordsId = ''
    } else {
      var hotWordsId = art
    }
    var params = {
      hotWordsId: hotWordsId,
      page: page,
      limit: config.limit
    }
    config.ajax('POST', params, config.videoList, (res) => {

      if (this.data.videoList.length != 0) {
        if(page==1){
          this.setData({
            videoList: res.data.data.list
          })
        }else{
          this.setData({
            videoList: this.data.videoList.concat(res.data.data.list)
          })
        }
      } else {
        this.setData({
          videoList: res.data.data.list,
          mask: true
        })
      }
      if (res.data.data.list.length < config.limit) {
        this.setData({
          nodata: true,
          allnum: res.data.data.totalCount
        })
      }
      wx.hideLoading()
    }, (res) => {

    })
  },
  /**
   * 获取是否显示广告
   */
  getAps(){
    var params = {
      location:'index'
    }
    config.ajax('POST', params, config.aps, (res) => {
      console.log(res.data.data)
      this.setData({
        aps: res.data.data
      })
    }, (res) => {

    })
  },
  /**
   * 播放事件
   */
  myvideoPlay: function (e) {
    console.log(e)
  },
  /**
   * 跳到detail列表
   */
  tolist(e){
    var alldata={
      id:e.currentTarget.dataset.id,
      bg: e.currentTarget.dataset.bg,
      name: e.currentTarget.dataset.name,
      ph: e.currentTarget.dataset.ph,
      num: e.currentTarget.dataset.num,
    }
    wx.navigateTo({
      url: '/pages/detail/detail?alldata='+JSON.stringify(alldata),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() 
    page = 1;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    this.videoGroup = this.selectComponent("#videoGroup");
    this.getvideoList()
    // this.getlistHot()
    this.getHotword()
    this.getAps()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.setData({
      playIndex: null
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this
    page++
    that.setData({
      moretype: '正在加载中~'
    })
    setTimeout(function () {
      that.getvideoList()
      that.setData({
        playIndex: null,
      })
    }, 2000)
  },
  submittwo(e) {
    console.log(1)
    if (app.globalData.isSubscibe) {
      var params = {
        openId: app.globalData.openid,
        formId: e.detail.formId,
        status: 't'
      }
    } else {
      var params = {
        openId: app.globalData.openid,
        formId: e.detail.formId
      }
    }
    config.ajax('POST', params, config.wxformId, (res) => {
 
      this.setData({
        isSubscibe:true
      })
      app.globalData.isSubscibe = true
    }, (res) => {

    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {

      if (res.target.dataset.id == '分享好友') {
        return {
          title: '我是分享好友的',
          path: '/pages/index/index'
        }
      } else {
        config.ajax('POST', {
          id: res.target.dataset.id,
          openid: app.globalData.openid
        }, config.videoShare, (res) => {

        }, (res) => {

        })
        var alldata = {
          id: res.target.dataset.id,
          title: res.target.dataset.title,
          cover: res.target.dataset.cover,
          duration: res.target.dataset.duration,
          allnum: res.target.dataset.allnum
        }
        return {
          title: alldata.title,
          path: '/pages/share/share?alldata=' + JSON.stringify(alldata),
          imageUrl: alldata.cover
        }
      }
    } else {
      return {
        title: '我是分享好友的',
        path: '/pages/index/index'
      }
    }
  }
})