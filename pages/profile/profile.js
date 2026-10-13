const petStore = require('../../utils/pet')
Page({
  data: { petName: '奶盖', level: 12, exp: 0, coins: 0, streak: 0, totalCare: 0, editing: false, draftName: '' },
  onShow() { const { pet } = petStore.getState(); this.setData({ petName: pet.name, level: pet.level, exp: pet.exp, coins: pet.coins, streak: pet.streak, totalCare: pet.totalCare, draftName: pet.name }) },
  startEdit() { this.setData({ editing: true }) },
  inputName(e) { this.setData({ draftName: e.detail.value }) },
  saveName() { const state = petStore.renamePet(this.data.draftName); this.setData({ petName: state.pet.name, draftName: state.pet.name, editing: false }); wx.showToast({ title: '新名字已保存', icon: 'success' }) },
  cancelEdit() { this.setData({ editing: false, draftName: this.data.petName }) },
  goBack() { wx.navigateBack() },
  contact() { wx.showModal({ title: 'Petday', content: '谢谢你愿意陪伴每一个小小的生命。', showCancel: false }) }
})
