// pages/goods_list/index.js
/*
1 用户上滑页面  滚动条触底  开始加载下一页数据
  1 找到滚动条触发事件 微信小程序管方开发文档
  2 判断是否有下一页数据
    1 获取到总页数 只有总条数 total
      总页数 = Math.ceil(总条数/页容量 pagesize)
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数
      表示  没有下一页数据
  3 假如没有下一页数据，弹出一个提示
  4 假如还有下一页数据  就加载下一页数据
    1 当前的页面 ++
    2 重新发送请求
    3 数据请求回来 要对data中的数据  进行 而不是全部替换
2 下拉刷新页面
  1 触发下拉刷新事件  需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据  数组
  3 重置页面  设置为1
  4 重新发送请求
  5 数据请求回来了 需要手动关闭 等待效果
*/
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 2,
        value: "销量",
        isActive: false
      },
      {
        id: 3,
        value: "价格",
        isActive: false
      }
    ],
    // 页面数据
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 赋值给接口传的条件
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // 获取总条数
    const total = res.data.message.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    // console.log(this.totalPages);
    this.setData({
      // goodsList:res.data.message.goods
      // 做分页处理 把旧的数据解构出来  拼接了数组
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })
    // 关闭下拉等待效果   如果没有调用下拉刷新 直接关闭是没有影响的
    wx.stopPullDownRefresh();
  },

  // 标题点击事件  从子组件传递过来的
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3  赋值到data中
    this.setData({
      tabs
    });
    console.log(e)
  },
  // 页面上滑  滚动条触底事件
  onReachBottom() {
    // 1 判断是否有下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      //没有下一页  弹出消息框
      wx.showToast({ title: '没有下一页' });

    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();

    }

  },
  // 下拉刷新事件
  onPullDownRefresh() {
    //1 重置数组
    this.setData({
      goodsList: []
    });
    //2 重置页码
    this.QueryParams.pagenum = 1;
    //3 发送请求
    this.getGoodsList();
  }

})