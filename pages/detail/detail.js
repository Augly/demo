// pages/index/index.js
var app = getApp();
var page = 1;
const config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodata: false,
    videoList: [],
    showother: true,
    playIndex: null,
    mask:false,
    page: 'detail',
    moretype:'上拉查看更多哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    var alldata=JSON.parse(options.alldata)
    this.setData({
      alldata:alldata,
      id: alldata.id,
      name: alldata.name,
      num: alldata.num,
      ph: alldata.ph,
      bg:alldata.bg
    })
    page=1
    this.getvideoList(this.data.id)
    this.videoGroup = this.selectComponent("#videoGroup")
    this.getAps()
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
        if (page == 1) {
          this.setData({
            videoList: res.data.data.list
          })
        } else {
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
   * 播放事件
   */
  myvideoPlay: function (e) {
    console.log(e)
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
   * 获取是否显示广告
   */
  getAps() {
    var params = {
      location: 'details'
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
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    page = 1
    this.getvideoList(this.data.id)
    this.videoGroup = this.selectComponent("#videoGroup")
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
    setTimeout(function(){
      that.getvideoList(that.data.id)
      that.setData({
        playIndex: null,
      })
    },2000)

  },
  /**
   * 挑往首页
   */
  toindex:function(){
    wx.navigateTo({
      url: '/pages/index/index',
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
          path: '/pages/detail/detail?alldata=' + JSON.stringify(this.data.alldata)
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
          durationd: res.target.dataset.durationd,
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
        path: '/pages/detail/detail?alldata=' + JSON.stringify(this.data.alldata)
      }
    }
  }
})