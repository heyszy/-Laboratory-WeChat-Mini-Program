// pages/main/mian.js
const app = getApp()

Page({
  data: {
    checked1: true,
    checked2: true,
    temperature:'0',
    humidity:'0',
  },

  onChange1({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked1: detail });
  },
  onChange2({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked2: detail });
  },
  onChange3({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked3: detail });
  },

  onLoad: function (options) {
    var that = this
    that.setData({
      temperature: Math.floor((Math.random() * 20) + 10),
      humidity: Math.floor((Math.random() * 20) + 60)
    })
    wx.setStorageSync('temperature', that.data.temperature);
    wx.setStorageSync('humidity', that.data.humidity);
    setInterval(function () {
      that.setData({
        temperature: Math.floor((Math.random() * 20) + 10),
        humidity: Math.floor((Math.random() * 20) + 60)
      })
      wx.setStorageSync('temperature', that.data.temperature);
      wx.setStorageSync('humidity', that.data.humidity);
    }, 600000)
  },

  upload:function(){
    connect.upload();
    
  },

 
})