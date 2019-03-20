const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const wxRequest = require('../../utils/wxRequest.js');
var page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    page: 0,
    isLastPage: false, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getData()
  },
  getData: function (index) {
    let that = this;
    let page = that.data.page;
    var query = {
      limit:10,
      page : page + 1
    }
    wx.showLoading({
      title: '正在加载',
      mask: true
    }); 
    var getPostsRequest = wxRequest.getRequest(api.getBlogList(query));
    getPostsRequest.then(res => {
      if (res.statusCode === 200) {
        const posts = res.data;
        for (var post of posts) {
          var time = util.formatTime(post.modified);
          post.modified = time;
        }
        that.setData({
          posts: this.data.posts.concat(posts),
          page: page + 1
        });
        setTimeout(function () {
          wx.hideLoading();
        }, 900);
      }else{
        that.setData({
          isLastPage: true
        });
        wx.showToast({
          title: '没有更多内容',
          mask: false,
          duration: 1500
        });
      }
    })
    .catch(function (response) {
    })
  },

  //点击文章明细
  bindItemTap: function (e){
    //本地存储
    var that = this;
    let index = e.currentTarget.id;;
    wx.setStorageSync('post', that.data.posts[index]);
    wx.navigateTo({
      url: '../detail/detail'
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.isLastPage) {
      that.getData();
      console.log('当前页' + that.data.page);
    }
    else {
      console.log('最后一页');
      wx.showToast({
        title: '没有更多内容',
        mask: false,
        duration: 1500
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})