// pages/detail/detail.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const WxParse = require('../../wxParse/wxParse.js');
const wxRequest = require('../../utils/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let post = (wx.getStorageSync('post') || []);
    console.log(post.length)
    if (post == 0) { 
      console.log(1111)
      let blogId = options.blogId;
      var getBlogDet = wxRequest.getRequest(api.getBlogDet(blogId));
      wx.showLoading({
        title: '正在加载',
        mask: true
      }); 
      getBlogDet.then(res => {
        if (res.statusCode === 200) {
          const post = res.data;
          console.log(post)
          var time = util.formatTime(post.modified);
          post.modified = time;
          that.setData({
            post: post
          });
          WxParse.wxParse('article', 'html', that.data.post.content.rendered, that, 5);
          setTimeout(function () {
            wx.hideLoading();
          }, 900);
        } else {
          console.log(res.data)
          wx.showToast({
            title: '没有更多内容',
            mask: false,
            duration: 1500
          });
        }
      })
    }
    else {
      that.setData({
        post: post
      })
      wx.removeStorage({
        key: 'post'
      })
      console.log(that.data.post)
      WxParse.wxParse('article', 'html', that.data.post.content.rendered, that, 5);
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.post.title.rendered,
      path: '/pages/detail/detail?blogId=' + this.data.post.id
    }
    console.log(this.data.post.title.rendered)
  }
})