/*
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断
  3 检验通过 把输入框的值  发送到后台
  4 返回的数组打印到页面上
2 防抖（防止抖动） 定时器  节流
  0 防抖 一般输入框中 防止重复输入  重复发送请求
  1 节流 一般是用在页面下拉和上拉
  1 定义全局的定时器id
*/
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮是否显示
    ifFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,
  // 输入框的值改变  就会触发改变
  handleInput(e) {
    // 1 获取输入框的值
    const { value } = e.detail;
    // 2 检查合法性 判断是否为空  trim() 去除两边空格
    if (!value.trim()) {
      // 当输入框中没有  那么就隐藏 取消  按钮
      this.setData({
        goods: [],
        ifFocus: false
      })
      // 值不合法
      return
    }
    // 当输入框中有值  那么就显示 取消  按钮
    this.setData({
      ifFocus: true
    })
    // 3 清除定时器
    clearTimeout(this.TimeId);
    // 4 开启定时器 一秒后发送请求
    this.TimeId = setTimeout(() => {
      // 5 准备发送请求获取数据
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求获取搜索建议  数据
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods: res.data.message
    })
  },
  // 取消 按钮
  handleCancel() {
    this.setData({
      inpValue: "",
      ifFocus: false,
      goods: []
    })
  }
})
//--------------------------------













