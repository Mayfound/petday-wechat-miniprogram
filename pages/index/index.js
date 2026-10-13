const petStore = require('../../utils/pet')
Page({
  data: { level: 12, exp: 48, coins: 128, streak: 3, checkedIn: false, petName: '奶盖', interacting: false, licking: false, pawing: false, pawHint: '碰爪', petMood: 'mood-hello', petTag: '点点我 · Hi!', pulseKey: '', actionNotice: '轻轻点一下，回应它的小期待', moodMessage: '奶盖想要一个抱抱', actionHint: '今天已经陪伴它 18 分钟啦', stats: [], actions: [{ key: 'feed', icon: '🍓', title: '喂食', points: 8, target: '饱腹', className: 'peach-bg' }, { key: 'play', icon: '◌', title: '玩耍', points: 12, target: '心情', className: 'purple-bg' }, { key: 'hug', icon: '♡', title: '抱抱', points: 6, target: '亲密', className: 'pink-bg' }] },
  onShow() { this.syncState(); this.setData({ intimacy: petStore.getState().stats.intimacy, pawFeedback: '' }) },
  syncState() { const state = petStore.getState(); const today = new Date(); const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`; this.setData({ petName: state.pet.name, level: state.pet.level, exp: state.pet.exp, coins: state.pet.coins, streak: state.pet.streak, checkedIn: state.pet.lastCheckin === key, actionHint: `已累计陪伴 ${state.pet.totalCare} 次`, stats: [{ key: 'food', icon: '♨', label: '饱腹感', value: state.stats.food, className: 'peach' }, { key: 'mood', icon: '♡', label: '好心情', value: state.stats.mood, className: 'pink' }, { key: 'energy', icon: '✦', label: '活力值', value: state.stats.energy, className: 'purple' }] }) },
  handleAction(e) { const key = e.currentTarget.dataset.key; const result = petStore.care(key); this.setData({ actionNotice: result.message, moodMessage: '奶盖的心意已被好好回应', interacting: false, pulseKey: '' }, () => { this.setData({ interacting: true, pulseKey: key === 'feed' ? 'food' : 'mood' }); this.syncState() }); clearTimeout(this.motionTimer); this.motionTimer = setTimeout(() => this.setData({ interacting: false, pulseKey: '' }), 760); wx.showToast({ title: '陪伴 +1', icon: 'success' }) },
  handleCheckin() { const result = petStore.checkin(); if (result.already) { wx.showToast({ title: '今天已经打过卡啦', icon: 'none' }); return }; this.setData({ actionNotice: `连续陪伴 ${result.state.pet.streak} 天，获得 10 陪伴币`, moodMessage: '奶盖记住了今天的温暖', interacting: false }); this.syncState(); setTimeout(() => this.setData({ interacting: true }), 30); clearTimeout(this.motionTimer); this.motionTimer = setTimeout(() => this.setData({ interacting: false }), 760); wx.showToast({ title: '陪伴打卡成功', icon: 'success' }) },
  petInteract() { const moments = [{ mood: 'mood-hello', tag: '耳朵动了动 · 喵~', notice: '奶盖正在认真听你说话。' }, { mood: 'mood-love', tag: '蹭蹭你 · ♡', notice: '奶盖把小脑袋靠近了你。' }, { mood: 'mood-play', tag: '想玩啦 · ◌', notice: '它歪着头，等你陪它玩。' }]; const next = moments[(moments.findIndex(x => x.mood === this.data.petMood) + 1) % moments.length]; petStore.petHello(); this.setData({ petMood: next.mood, petTag: next.tag, actionNotice: next.notice, interacting: false, pulseKey: '' }); this.syncState(); setTimeout(() => this.setData({ interacting: true }), 20); clearTimeout(this.motionTimer); this.motionTimer = setTimeout(() => this.setData({ interacting: false }), 760) },
  startLick() { this.setData({ licking: true, petTag: '洗洗小爪爪 · 舔~' }) },
  endLick() { this.setData({ licking: false, petTag: '点点我 · Hi!' }) },
  pawInteract() {
    if (this.data.pawing) return
    clearTimeout(this.motionTimer)
    clearTimeout(this.pawTimer)
    const before = petStore.getState().stats.intimacy
    const state = petStore.petHello()
    const gained = state.stats.intimacy - before
    this.setData({
      pawing: true, interacting: false, licking: false,
      pawHint: '击掌成功', intimacy: state.stats.intimacy,
      pawFeedback: gained ? `亲密度 +${gained} · 经验 +1` : '亲密度已满 · 经验 +1',
      petTag: '啪！和你碰爪啦 ♡',
      actionNotice: `${state.pet.name}把软软的小爪爪递给了你。`,
      moodMessage: '碰爪成功，今天又亲近了一点', pulseKey: ''
    })
    this.syncState()
    this.pawTimer = setTimeout(() => {
      this.setData({ pawing: false, pawHint: '碰爪', pawFeedback: '', petTag: '再碰一次爪吧 · ♡' })
    }, 1600)
  },
  onHide() {
    clearTimeout(this.motionTimer)
    clearTimeout(this.pawTimer)
    this.setData({ pawing: false, interacting: false, licking: false, pawHint: '碰爪', pawFeedback: '', pulseKey: '' })
  },
  stopTouch() {},
  onUnload() { clearTimeout(this.motionTimer); clearTimeout(this.pawTimer) },
  navigate(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  showComingSoon() { wx.showToast({ title: '更多小惊喜正在准备中', icon: 'none' }) }
})
