// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params)=>{
    // 同时发送异步请求的次数累加，比如同时调用了三次，那么ajaxTimes=3
    ajaxTimes++;
    // 显示一个加载中  效果
    wx.showLoading({
        title: "加载中",
        mask: true,
    });
      
    // 定义公共的url
    //  url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    // 使用es6  中promise 方法处理接口异步请求的嵌套
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            // 不管返回成功或失败都调用
            complete:()=>{
                // 同时发送异步请求的次数累减，比如同时调用了三次，那么ajaxTimes=3 变到ajaxTimes=0，然后在执行条件中的关闭正在等待的图标
                ajaxTimes--;
                if(ajaxTimes===0){
                    // 关闭正在等待的图标
                    wx.hideLoading();
                }
            }
        });
    })
}