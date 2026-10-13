const STORAGE_KEY = 'petday_state_v1'

const defaultState = {
  pet: { name: '奶盖', level: 12, exp: 48, coins: 128, streak: 3, lastCheckin: '', totalCare: 18 },
  stats: { food: 76, mood: 92, energy: 64, intimacy: 68 },
  diary: [
    { id: 'welcome', date: '今天', icon: '☀️', title: '奶盖来到校园的第 12 天', content: '它在图书馆门口晒了好久的太阳。' },
    { id: 'walk', date: '昨天', icon: '🌿', title: '晚风散步', content: '操场的风很轻，奶盖追着落叶跑了三圈。' }
  ],
  activities: [
    { id: 'walk', icon: '🌇', title: '傍晚校园散步', time: '今天 17:30', points: 12, done: false, color: 'sunset' },
    { id: 'water', icon: '💧', title: '记得补充水分', time: '今天 20:00', points: 6, done: false, color: 'sky' },
    { id: 'photo', icon: '📷', title: '拍一张合照', time: '本周挑战', points: 20, done: false, color: 'lavender' }
  ]
}

function clone(value) { return JSON.parse(JSON.stringify(value)) }
function dateKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` }
function getState() { return wx.getStorageSync(STORAGE_KEY) || clone(defaultState) }
function saveState(state) { wx.setStorageSync(STORAGE_KEY, state); return state }
function addExp(state, amount) {
  state.pet.exp += amount
  while (state.pet.exp >= 100) { state.pet.exp -= 100; state.pet.level += 1 }
}
function care(action) {
  const state = getState(); const map = { feed: ['food', 8, '🍓', '草莓小点心', '奶盖吃得很开心，尾巴翘起来啦！'], play: ['mood', 12, '🫧', '一起玩耍', '它追着光点转了三个圈！'], hug: ['intimacy', 6, '🤍', '温柔抱抱', '奶盖蹭了蹭你的手心。'] }
  const [key, amount, icon, title, message] = map[action]
  state.stats[key] = Math.min(100, state.stats[key] + amount)
  state.stats.energy = Math.max(0, state.stats.energy - (action === 'play' ? 4 : 1))
  state.pet.coins += 2; state.pet.totalCare += 1; addExp(state, amount)
  state.diary.unshift({ id: `${Date.now()}`, date: '刚刚', icon, title, content: message })
  saveState(state); return { state, message }
}
function checkin() {
  const state = getState(); const today = dateKey()
  if (state.pet.lastCheckin === today) return { state, already: true }
  state.pet.streak += 1; state.pet.lastCheckin = today; state.pet.coins += 10; state.pet.totalCare += 1; addExp(state, 10)
  state.diary.unshift({ id: `${Date.now()}`, date: '今天', icon: '✨', title: `连续陪伴第 ${state.pet.streak} 天`, content: '今天的温柔已经被奶盖认真收下。' })
  saveState(state); return { state, already: false }
}
function addDiary(content) { const state = getState(); state.diary.unshift({ id: `${Date.now()}`, date: '今天', icon: '📝', title: '写给奶盖的话', content }); saveState(state); return state }
function finishActivity(id) { const state = getState(); const item = state.activities.find(x => x.id === id); if (!item || item.done) return { state, already: true }; item.done = true; state.pet.coins += item.points; state.stats.mood = Math.min(100, state.stats.mood + 8); addExp(state, item.points); state.diary.unshift({ id: `${Date.now()}`, date: '今天', icon: item.icon, title: item.title, content: `完成计划，获得 ${item.points} 枚陪伴币。` }); saveState(state); return { state, item, already: false } }
function renamePet(name) { const state = getState(); state.pet.name = name.trim() || state.pet.name; saveState(state); return state }
function petHello() { const state = getState(); state.stats.intimacy = Math.min(100, state.stats.intimacy + 1); state.pet.totalCare += 1; addExp(state, 1); saveState(state); return state }

module.exports = { getState, care, checkin, addDiary, finishActivity, renamePet, petHello }
