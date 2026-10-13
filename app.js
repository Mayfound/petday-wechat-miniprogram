const petStore = require('./utils/pet')

App({
  onLaunch() {
    petStore.getState()
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.login({
      success: () => {}
    })
  },
  globalData: {
    userInfo: null
  }
})
