//Page Object
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航 数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  //页面开始加载的时候就会触发
  onLoad: function(options) {
    // 1 发送异步请求，获取轮播图数据
    // 2 
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   data: {},
    //   header: {'content-type':'application/json'},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
     this.getSwiperList();
     this.getCateList();
     this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      result.data.message.forEach((v, i) => {
        v.navigator_url=v.navigator_url.replace("main", "index");
      });
      this.setData({
        swiperList:result.data.message
      })
      console.log(this.data.swiperList);
    })
  },
  // 获取分类导航
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
        catesList:result.data.message
      })
    })
  },
  // 获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
        floorList:result.data.message
      })
    })
  }
});
  