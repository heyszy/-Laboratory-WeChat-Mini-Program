//app.js

App({
  onLaunch: function () {
  },
  globalData:{
    as: "RpcC60IOkAHDLxcN213HnkTsYBeWa8",//AccessKey Secret
    productKey: "a1rA69pr9HV",
    deviceName: "a001",
    endpoint: "https://iot.cn-shanghai.aliyuncs.com",
    ai: "LTAI4G3TT17iSEYqCBx2nLF3", //AccessKeyId
    apiVersion: '2018-01-20'
  },

  // 设置监听器
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
    this.observer(ctx.data, key, ctx.data[key], function (value) {
      obj[key].call(ctx, value)
    })
    })
  },
  // 监听属性，并执行监听函数
  observer: function (data, key, val, fn) {
    Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      fn && fn(newVal)
      val = newVal
    },
    })
  }
})