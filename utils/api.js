const apiUrl = 'https://fengyu.zhulifeng.com/wp-json/wp/v2';

const wxRequest = (params, url) => {
  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};
/**
 * 获取文章
 */
const getBlogDet = (id) => {
  var url = `${apiUrl}/posts/${id}`;
  return url
};
/**
 * 分页获取文章列表url
 */
const getBlogList = (params) => {
  var url = `${apiUrl}/posts?page=${params.page}&per_page=${params.limit}&orderby=date&order=desc`;
  return url
};

//以标签为根本获取文章分类列表标题
const getBlogTags = (params) => {
  var url = `${apiUrl}/tags`;
  return url
};

//获取分类文章列表
const getBlogTagPosts = (params) => {
  var url = `${apiUrl}/posts?page=${params.page}&per_page=${params.limit}&tags=${params.id}&orderby=date&order=desc`;
  return url
};
module.exports = {
  getBlogDet,
  getBlogList,
  getBlogTags,
  getBlogTagPosts
};
