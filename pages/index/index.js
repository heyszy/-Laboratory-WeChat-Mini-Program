const aliSdk = require("../../utils/aliIot-sdk.js")
const app = getApp()
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    temp:" ",
    gasA:" ",
    gasB:" ",
    power: true,
    fireExtinguisher: false,
    tempcolor:"",
    gasAcolor:"",
    gasBcolor:""
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    setInterval(function () {
      that.loadData();
    }, 500)
    //数据监听
    app.watch(that, {
      temp: function (newVal) {
        console.log("new temp: " + newVal)
        if(that.data.temp <= 120 && newVal > 120){
          that.warning(newVal,that.data.gasA,that.data.gasB);
          console.log("temp warning" )
        }
        if(newVal > 120){
          that.setData({
            tempcolor:"red"
          })
        }else{
          that.setData({
            tempcolor:""
          })
        }
      },
      gasA: function (newVal) {
        console.log("new gasA: " + newVal)
        if(that.data.gasA <= 200 && newVal > 200){
          that.warning(that.data.temp,newVal,that.data.gasB);
        }
        if(newVal > 200){
          that.setData({
            gasAcolor:"red"
          })
        }else{
          that.setData({
            gasAcolor:""
          })
        }
      },
      gasB: function (newVal) {
        console.log("new gasB: " + newVal)
        if(that.data.gasB <= 300 && newVal > 300){
          that.warning(that.data.temp,that.data.gasA,newVal);
        }
        if(newVal > 300){
          that.setData({
            gasBcolor:"red"
          })
        }else{
          that.setData({
            gasBcolor:""
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.loadData()
    
  },
  //通过封装的sdk读取物联网平台数据
  loadData: function () {
    var that = this
    aliSdk.request({
        Action: "QueryDevicePropertyStatus",
        ProductKey: app.globalData.productKey,
        DeviceName: app.globalData.deviceName
      }, {
        method: "POST"
      },
      (res) => {
        // console.log("success")
        // console.log(res) //查看返回response数据
        if (res.data.Code) {
          console.log(res.data.ErrorMessage)
          wx.showToast({
            title: '设备连接失败',
            icon: 'none',
            duration: 1000,
            // complete: () => {}
          })
          that.setPropertyData(null)
        } else {
          that.setPropertyData(res.data.Data.List.PropertyStatusInfo)
        }
      },
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          // complete: () => {}
        })
        this.setPropertyData(null)
      }
      // ,
      // (res) => {
      //   console.log("complete")
      // }
      )
  },

  //设置前端数据
  setPropertyData: function (infos) {
    var that = this
    if (infos) {
      var propertys = that.convertPropertyStatusInfo(infos)
      that.setData({
        temp: propertys.temperature,
        gasA: propertys.gasA,
        gasB: propertys.gasB
      })
    } else {
      that.setData({
        temp: "--",
        gasA: "--",
        gasB: "--"
      })
    }
  },

  //将返回结果转成key,value的json格式方便使用
  convertPropertyStatusInfo: function (infos) {
    var data = {}
    infos.forEach((item) => {
      data[item.Identifier] = item.Value ? item.Value : null
    })
    return data
  },

  //电源
  powerchange: function () {
    var that = this
    //防止重复点击
    // that.setData({
    //   buttonDisabled: true
    // })
    
    aliSdk.request({
        Action: "InvokeThingService",
        ProductKey: app.globalData.productKey,
        DeviceName: app.globalData.deviceName,
        Identifier: that.data.power?"poweroff" : "poweron",
        Args: "{}" //无参服务，所以传空
      }, {
        method: "POST"
      },
      (res) => {
        console.log("success")
        console.log(res) //查看返回response数据
        that.setData({
          power: !that.data.power
        })
      },
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          // complete: () => {}
        })
      },
      (res) => {
        // console.log("complete")
      })
  },

  //灭火
  firechange: function () {
    var that = this
    //防止重复点击
    // that.setData({
    //   buttonDisabled: true
    // })
    
    aliSdk.request({
        Action: "InvokeThingService",
        ProductKey: app.globalData.productKey,
        DeviceName: app.globalData.deviceName,
        Identifier: that.data.fireExtinguisher?"stopExtinguish" : "startExtinguish",
        Args: "{}" //无参服务，所以传空
      }, {
        method: "POST"
      },
      (res) => {
        console.log("success")
        console.log(res) //查看返回response数据
        that.setData({
          fireExtinguisher: !that.data.fireExtinguisher
        })
      },
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          // complete: () => {}
        })
      },
      (res) => {
        // console.log("complete")
      })
      // console.log(that.data.fireExtinguisher)
  },

  //阈值报警
  warning:function(t,a,b){
    if(t > 120 && a >200 && b > 300){
      Dialog.alert({
        title: '警告',
        message: '温度、气体A、气体B浓度均超出阈值！',
        }).then(() => {
        // on close
      });
    }
    else if(t > 120 && a > 200){
      Dialog.alert({
        title: '警告',
        message: '温度、气体A浓度超出阈值！',
        }).then(() => {
        // on close
      });
    }
    else if(t > 120 && b > 300){
      Dialog.alert({
        title: '警告',
        message: '温度、气体B浓度超出阈值！',
        }).then(() => {
        // on close
      });
    }
    else if(b > 300 && a > 200){
      Dialog.alert({
        title: '警告',
        message: '气体A、气体B浓度超出阈值！',
        }).then(() => {
        // on close
      });
    }
    else if(t > 120){
      Dialog.alert({
        title: '警告',
        message: '温度超出阈值！',
        }).then(() => {
        // on close
      });
    }
    else if(a > 200){
      Dialog.alert({
        title: '警告',
        message: '气体A浓度超出阈值！',
        }).then(() => {
        // on close
      });
    }
    else if(b > 300){
      Dialog.alert({
        title: '警告',
        message: '气体B浓度超出阈值！',
        }).then(() => {
        // on close
      });
    }
  },












  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})