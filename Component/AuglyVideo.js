// Component/AuglyVideo.js
const config=require('../utils/config.js')
let app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoList: {
      type: Array,
      value: []
    },
    aps:{
      type:Object,
      value:{
        isShow:null
      }
    },
    playIndex:{
      type:null,
      value:null
    },
    page:{
      type: String,
      value:'index'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playIndex: null,
    showPlay: false,
    showShare:true
  },
  created:function(){
    console.log(this.data.aps)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //播放视频相关方法
    videoPlay:function(e){
      // if (this.data.page=='share'){
        var videoList = this.data.videoList
        var index = e.currentTarget.dataset.index
        var id = e.currentTarget.id
        config.ajax('POST', {
          id: id
        }, config.videoPlay, (res) => {
          if (res.data.statusMsg == "success") {
            videoList[index].videoUrl = res.data.data
            if (!this.data.playIndex) { // 没有播放时播放视频
              this.setData({
                videoList: videoList,
                playIndex: index,
                playmid: id
              })
              var videoContext = wx.createVideoContext('myVideo' + id, this)
              videoContext.play()
            } else {                    // 有播放时先将prev暂停到0s，再播放当前点击的current
              var videoContextPrev = wx.createVideoContext('myVideo' + this.data.playmid, this)
              videoContextPrev.seek(0)
              videoContextPrev.pause()
              this.setData({
                videoList: videoList,
                playIndex: index,
                playmid: id
              })
              var videoContextCurrent = wx.createVideoContext('myVideo' + this.data.playmid, this)
              videoContextCurrent.play()
            }
            var myEventDetail = {
              playIndex: this.data.playIndex,
              playmid: this.data.playmid,
              videoContextCurrent: videoContextCurrent,
              videoContext: videoContext
            } // detail对象，提供给事件监听函数
            var myEventOption = {

            } // 触发事件的选项
            this.triggerEvent('videoPlay', myEventDetail, myEventOption)
          }
        }, (res) => {

        })
      // }else{
      //   var alldata = {
      //     id: e.currentTarget.dataset.id,
      //     title: e.currentTarget.dataset.title,
      //     cover: e.currentTarget.dataset.cover,
      //     duration: e.currentTarget.dataset.duration,
      //     allnum: e.currentTarget.dataset.allnum
      //   }
      //   wx.redirectTo({
      //     url: '/pages/share/share?alldata=' + JSON.stringify(alldata),
      //     success: function(res) {

      //     },
      //     fail: function(res) {},
      //     complete: function(res) {},
      //   })
      // } 
    },
    submitInfo(e) {
      if (app.globalData.isSubscibe){
        var params = {
          openId: app.globalData.openid,
          formId: e.detail.formId,
          status:'t'
        }
      }else{
        var params = {
          openId: app.globalData.openid,
          formId: e.detail.formId
        }
      }
      config.ajax('POST', params,config.wxformId,(res)=>{
        console.log(res)
        app.globalData.isSubscibe=true
      },(res)=>{

      })
    }
  }
})
