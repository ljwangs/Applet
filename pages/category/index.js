// pages/category/index.js
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0

  },
  // 接口返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    0 web中的本地存储 和小程序中的本地存储的区别
      1 写代码的方式不一样了
        web中：
          localStorage.setItem("key","value")  存值
          localStorage.getItem("key")  取值
        小程序中：
          wx.setStorageSync("key", "value"); 存值
          const Cates = wx.getStorageSync("key");  取值
      2 存的时候 有没有做类型的转换
        web:不管存入的是什么类型的数据，最终都会先调用一下 toString()，把数据变成了字符串 在存入进去
        小程序：不存在类型的这个操作 存什么类型的数据进去，获取的就是什么类型的数据

    1 先判断一下本地存储中有没有旧的数据
    {time:Date.now(),data:[...]}
    2 没有旧数据  直接发送新请求
    3 有旧数据 同时 旧的数据也没有过期，就使用 本地存储中的旧数据即可
    */


    // 第一步   获取本地存储中的数据 （小程序中也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    // 第二步 判断
    if (!Cates) {
      //不存在  发送请求获取数据
      this.getCates();
    } else {
      // 表示有旧数据  自己定义一个过期时间  10s  成功后在改成5分钟
      if (Date.now() - Cates.tiem > 1000 * 10) {
        // 当前时间减去存储中的时间大于10秒后，就重新发送请求
        this.getCates();
      } else {
        // 当前时间减去存储中的时间小于10秒后，就使用旧数据
        //赋值
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList, rightContent
        })
        console.log('旧数据')
      }
    }


  },
  // 获取分类数据
  async getCates() {
    // 第一种  Promise  方法
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     this.Cates = res.data.message;
    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { tiem: Date.now(), data: this.Cates });

    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v =>v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList, rightContent
    //     })
    //   })
    // 第二种 使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res.data.message;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { tiem: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList, rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    //1 获取被点击的标题身上的索引
    //2 给data中的currentIndex赋值就可以了
    //3 根据不同的索引渲染右边的商品
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置  右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
  }

})