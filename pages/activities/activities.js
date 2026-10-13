const petStore = require('../../utils/pet')
Page({
  data: { activities: [], coins: 0, doneCount: 0 },
  onShow() { this.sync() },
  sync() { const state = petStore.getState(); this.setData({ activities: state.activities, coins: state.pet.coins, doneCount: state.activities.filter(x => x.done).length }) },
  finish(e) { const result = petStore.finishActivity(e.currentTarget.dataset.id); if (result.already) { wx.showToast({ title: '这个计划已经完成啦', icon: 'none' }); return }; this.sync(); wx.showToast({ title: `获得 ${result.item.points} 陪伴币`, icon: 'success' }) },
  goBack() { wx.navigateBack() }
})
