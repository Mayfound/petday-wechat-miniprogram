const petStore = require('../../utils/pet')
Page({
  data: { diary: [], input: '', placeholder: '记录今天和奶盖的小瞬间…' },
  onShow() { this.setData({ diary: petStore.getState().diary }) },
  inputChange(e) { this.setData({ input: e.detail.value }) },
  saveDiary() { const content = this.data.input.trim(); if (!content) { wx.showToast({ title: '写一点今天的心情吧', icon: 'none' }); return }; const state = petStore.addDiary(content); this.setData({ diary: state.diary, input: '' }); wx.showToast({ title: '已收进陪伴日记', icon: 'success' }) },
  goBack() { wx.navigateBack() }
})
