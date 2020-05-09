/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
   这些数据 checked=true；的商品才传过来
2 微信支付
  哪些人 哪些账号 可以实现微信支付
  1 企业账号
  2 企业账号的小程序后台中 必须给开发者 添加上白名单
    1 一个appid可以同时绑定多个开发者
    2 这些开发者就可以共用这个appid 和它的开发权限了
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token
  3 有 token... 就进行正常的逻辑
  4 创建订单 获取订单编号
*/
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //1.1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });

    // 总价格  总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart, totalNum, totalPrice, address
    });
  },
  // 支付按钮绑定事件
  async handleOrderPay() {
    try {
      // 1判断缓存中是否有token
      const token = wx.getStorageSync("token");
      // 2判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      console.log(token);
      // 3创建订单
      // 3.1 准备 请求头参数
      const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 4准备发送请求 创建订单 获取订单编号
      const res = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header: header });
      // 5发起预支付接口
      const order_number = {
        order_number: res.data.message.order_number
      }
      const res2 = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: order_number, header });
      const pay = res2.data.message.pay
      console.log(pay);
      // 6发起微信支付
      // const res3 = await requestPayment(res2.data.message.pay);
      wx.requestPayment({
        timeStamp: pay.timeStamp,
        nonceStr: pay.nonceStr,
        package: pay.package,
        signType: pay.signType,
        paySign: pay.paySign,
        success: (result) => {
          console.log(result);
        },
        fail: (err) => {
          console.log(err);

        },
        complete: () => { }
      });

      // 7 查询后台 订单状态
      const res5 = await request({ url: "/my/orders/chkOrder", method: "POST", data: order_number, header });
      await showToast({title:"支付成功"});
    } catch (error) {
      await showToast({title:"支付失败"});

    }
  }
})