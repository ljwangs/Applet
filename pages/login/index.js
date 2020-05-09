// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    // 存储到缓存中
    wx.setStorageSync("userinfo",userInfo);
    // 跳转到上一级
    wx.navigateBack({
      delta: 1
    });
  }
})