// pages/auth/index.js
import { login } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";

Page({
  // 获取授权点击事件
  async handleGetUserInfo(e) {
    try {
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2 获取小程序登录成功后的code值,微信小程序登录接口
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 3 发送请求 获取用户的token   个人版本的无法获取得到token的
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      // 4 把token存入缓存中 同时跳转回上一个页面
      // 当我们个人的appid无法获取到token的时候，用原来接口上的token存到本地存储中一下就可以了
      // token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
      wx.setStorageSync("token", token);
      // 返回上一层
      wx.navigateBack({
        delta: 1
      });
        
    } catch (error) {
      console.log(error);
    }
  }
})