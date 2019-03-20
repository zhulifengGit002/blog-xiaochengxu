// pages/topic/topic.js
const { Tab, extend } = require('../../dist/index');
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const wxRequest = require('../../utils/wxRequest.js');

Page(extend({}, Tab, {
  /**
   * 页面的初始数据
   */
  data: {
    navTab: {
      list: [],
      selectedId: '',
      scroll: true,
      height: 45
    },
    posts: [],
    page: 0,
    isLastPage: false, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getTagData();
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
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.setData({
      page: 0,
      isLastPage: true,
      posts: [],
      [`${componentId}.selectedId`]: selectedId
    });
    this.getPostsData();
  },
  //获取文章的列表标题
  getTagData: function(){
    let that = this;
    let navList = [];
    var getTagsRequest = wxRequest.getRequest(api.getBlogTags());
    getTagsRequest.then(res => {
      const tags = res.data;
      for (var tag of tags) {
        navList.push(
          {
            'id': tag.id,
            'title': tag.name
          }
        )
      }
      that.setData({
        'navTab.list': navList,
        'navTab.selectedId': navList[0].id
      });
      that.getPostsData();
    })
  },
  //获取标签文章
  getPostsData: function (index) {
    let that = this;
    let page = that.data.page;
    let selectId = that.data.navTab.selectedId;
    wx.showLoading({
      title: '正在加载',
      mask: true
    }); 
    var query = {
      limit: 10,
      page: page + 1,
      id: selectId
    }
    var getBlogTagPosts = wxRequest.getRequest(api.getBlogTagPosts(query));
    getBlogTagPosts.then(res => {
      if (res.statusCode === 200) {
        const posts = res.data;
        console.log(posts)
        for (var post of posts) {
          var time = util.formatTime(post.modified);
          post.modified = time;
        }
        if (posts.length < 10){
          that.setData({
            posts: this.data.posts.concat(posts),
            isLastPage: true
          });
        }else{
          that.setData({
            posts: this.data.posts.concat(posts),
            page: page + 1,
          });
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 900);
      } else {
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
  },
  //点击文章明细
  bindItemTap: function (e) {
    //本地存储
    var that = this;
    let index = e.currentTarget.id;;
    wx.setStorageSync('post', that.data.posts[index]);
    wx.navigateTo({
      url: '../detail/detail'
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
}))