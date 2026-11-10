<template>
  <div class="phone-wrapper">
    <div class="phone" :class="`phase-${phase}`">
      <!-- 手機頂部：狀態列 -->
      <div class="status-bar">
        <span>{{ currentTime }}</span>
        <div class="status-right">
          <span class="pill-tag">5G</span>
          <span>100%</span>
          <svg width="20" height="13" viewBox="0 0 24 14" fill="#ffffff">
            <rect x="1" y="1" width="18" height="12" rx="3" stroke="#ffffff" stroke-width="2" fill="none" />
            <rect x="3" y="3" width="14" height="8" rx="1.5" fill="#ffffff" />
            <path d="M21 4V10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- 新北校園通 APP 個人資訊頂卡 -->
      <div class="phone-header-card">
        <div class="school-info-row">
          <span>📍 新北市教育科技展</span>
          <span class="expo-pill">大會限定</span>
        </div>
        <div class="user-profile-row">
          <div class="user-avatar-wrap">
            <div class="user-avatar">
              <img :src="asset('ton.png')" alt="小通" />
            </div>
            <div>
              <div class="user-name-line">
                <span class="user-name">新北親師生</span>
                <span class="user-role">參觀者</span>
              </div>
              <div class="user-points">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" stroke-width="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span>9999 點</span>
              </div>
            </div>
          </div>
          <div class="million-badge">✨ 百萬首選</div>
        </div>
      </div>

      <!-- 常用功能標籤與即時操作提示 -->
      <div class="function-bar" :class="phase">
        <span class="function-bar-title">常用功能</span>
        <span class="function-bar-hint">
          <template v-if="phase === 'correct'">✓ 答對了！就是這個功能</template>
          <template v-else-if="phase === 'wrong'">再選一次，找出正確功能</template>
          <template v-else>👇 請點選正確的功能圖示</template>
        </span>
      </div>

      <!-- 3x3 功能九宮格（原版 APP 圖示呈現） -->
      <div class="modules-grid">
        <button
          v-for="mod in modules"
          :key="mod.key"
          class="module-tile"
          :class="tileClass(mod.key)"
          :disabled="phase === 'correct'"
          :aria-label="mod.name"
          @click="onTap(mod.key, $event)"
        >
          <span
            v-if="mod.key === wrongKey"
            :key="`w-${wrongPulse}`"
            class="tile-tag tag-wrong"
          >✕ 不是這個</span>
          <span v-else-if="isCorrectTile(mod.key)" class="tile-tag tag-correct">✓ 正確</span>
          <span v-else-if="triedKeys.includes(mod.key)" class="tile-tag tag-tried">✕</span>

          <span class="tile-icon-box" :style="{ background: mod.tint, borderColor: `${mod.color}33` }">
            <img :src="asset(mod.icon)" :alt="mod.name" class="tile-icon-img" />
          </span>
          <span class="tile-name">{{ mod.name }}</span>
        </button>
      </div>

      <!-- 原版 APP 底部四大導覽列（第三個 Tab 使用「教育放送臺_未選取.png」） -->
      <div class="phone-tabs">
        <div class="tab-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>首頁</span>
        </div>
        <div class="tab-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>校務大小事</span>
        </div>
        <div class="tab-item">
          <span class="tab-badge">888</span>
          <img :src="asset(broadcastTabUnselectedIcon)" alt="教育放送臺" class="tab-icon-img" />
          <span>教育放送臺</span>
        </div>
        <div class="tab-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>設定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { PHONE_MODULES, BROADCAST_TAB_UNSELECTED_ICON } from '../data/phoneModules'
import { asset } from '../utils/asset'

const props = defineProps({
  phase: { type: String, required: true },
  targetKey: { type: String, required: true },
  wrongKey: { type: String, default: '' },
  triedKeys: { type: Array, default: () => [] },
  wrongPulse: { type: Number, default: 0 }
})

const emit = defineEmits(['select'])

const modules = PHONE_MODULES
const broadcastTabUnselectedIcon = BROADCAST_TAB_UNSELECTED_ICON

// 只在「答對」狀態才標示正確答案，避免提前洩漏
function isCorrectTile(key) {
  return props.phase === 'correct' && key === props.targetKey
}

function tileClass(key) {
  return {
    'is-wrong': key === props.wrongKey,
    'is-tried': props.triedKeys.includes(key) && key !== props.wrongKey,
    'is-correct': isCorrectTile(key),
    'is-dimmed': props.phase === 'correct' && key !== props.targetKey
  }
}

function onTap(key, event) {
  const rect = event.currentTarget.getBoundingClientRect()
  emit('select', key, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
}

const currentTime = ref('')
let clockTimer = null

function updateClock() {
  const now = new Date()
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 10000)
})

onUnmounted(() => clearInterval(clockTimer))
</script>

<style scoped>
.phone-wrapper {
  height: 100%;
  display: flex;
}

.phone {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 11px solid #0f172a;
  border-radius: 46px;
  box-shadow: 0 0 0 3px #38bdf8, 0 20px 48px rgba(2, 132, 199, 0.26);
  overflow: hidden;
}

.status-bar {
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 26px;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(90deg, #0284c7, #1d4ed8);
}

.status-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill-tag {
  background: rgba(255, 255, 255, 0.28);
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 900;
}

/* 原版 APP 藍色個人資訊頂卡 */
.phone-header-card {
  background: linear-gradient(180deg, #1d4ed8 0%, #0284c7 65%, #0ea5e9 100%);
  color: #fff;
  padding: 10px 22px 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.school-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #e0f2fe;
  margin-bottom: 6px;
  font-weight: 900;
}

.expo-pill {
  background: rgba(255, 255, 255, 0.24);
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 13px;
}

.user-profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-avatar-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 2.5px solid #fde047;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 86%;
  height: 86%;
  object-fit: contain;
}

.user-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-name {
  font-size: 19px;
  font-weight: 900;
}

.user-role {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 5px;
  font-weight: 800;
}

.user-points {
  font-size: 14px;
  font-weight: 900;
  color: #fef08a;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.million-badge {
  background: rgba(255, 255, 255, 0.22);
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 900;
}

/* 常用功能列與狀態提示 */
.function-bar {
  padding: 9px 22px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1.5px solid #e2e8f0;
  flex-shrink: 0;
  transition: background 0.25s ease;
}

.function-bar.wrong {
  background: #fef3c7;
}

.function-bar.correct {
  background: #d1fae5;
}

.function-bar-title {
  font-size: 18px;
  font-weight: 900;
  color: #1e293b;
}

.function-bar-hint {
  font-size: 17px;
  font-weight: 900;
  color: var(--c-brand-700);
}

.function-bar.wrong .function-bar-hint {
  color: var(--c-retry-800);
}

.function-bar.correct .function-bar-hint {
  color: var(--c-success-700);
}

.modules-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 12px;
  padding: 14px 18px;
  background: #ffffff;
}

/* 每格約 196 × 185 CSS px，遠大於 100 × 100 觸控下限 */
.module-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 6px;
  background: #ffffff;
  border: 2px solid #f1f5f9;
  border-radius: 20px;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
  transition: transform 0.12s ease, opacity 0.28s ease, border-color 0.2s ease, background 0.2s ease;
}

.module-tile:active:not(:disabled) {
  transform: scale(0.95);
  background: var(--c-brand-50);
}

.module-tile:disabled {
  cursor: default;
}

/* 原版 APP 圖示容器：柔和淺底襯托原版彩色圖示 */
.tile-icon-box {
  width: 84px;
  height: 84px;
  border-radius: 22px;
  border: 1.5px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  pointer-events: none;
  flex-shrink: 0;
}

.tile-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.tile-name {
  font-size: 24px;
  font-weight: 900;
  color: var(--c-ink-900);
  letter-spacing: -0.3px;
  white-space: nowrap;
  pointer-events: none;
}

/* 角標定位於按鈕內側右上角，不超出網格邊界 */
.tile-tag {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 900;
  color: #fff;
  pointer-events: none;
  animation: popIn 0.22s ease-out;
  z-index: 2;
}

.tag-wrong { background: #d97706; }
.tag-correct { background: var(--c-success-500); }
.tag-tried {
  background: #94a3b8;
  padding: 2px 8px;
}

.module-tile.is-wrong {
  border-color: var(--c-retry-500);
  background: var(--c-retry-50);
  animation: softShake 0.38s ease-in-out;
}

.module-tile.is-tried {
  border-style: dashed;
  opacity: 0.72;
}

.module-tile.is-correct {
  border: 4px solid var(--c-success-500);
  background: var(--c-success-50);
  transform: scale(1.03);
  z-index: 2;
  animation: pulseRing 1.2s ease-out 3;
}

.module-tile.is-dimmed {
  opacity: 0.38;
}

/* 原版 APP 底部四大 Tab 列 */
.phone-tabs {
  height: 62px;
  background: #f8fafc;
  border-top: 1.5px solid #e2e8f0;
  padding: 6px 12px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-shrink: 0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #828282;
  font-size: 13px;
  font-weight: 800;
  position: relative;
}

.tab-item.active {
  color: #0284c7;
}

.tab-icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: 2px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: 999px;
}
</style>
