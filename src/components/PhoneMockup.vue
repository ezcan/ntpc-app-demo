<template>
  <div class="phone-wrapper">
    <div class="phone" :class="`phase-${phase}`">
      <!-- 手機狀態列 -->
      <div class="status-bar">
        <span>{{ currentTime }}</span>
        <span class="status-right">5G　100%</span>
      </div>

      <!-- APP 標題列 -->
      <div class="app-bar">
        <img :src="asset('icon.png')" alt="" class="app-bar-icon" />
        <span class="app-bar-name">新北校園通</span>
      </div>

      <!-- 手機內操作提示：與狀態同步，絕不同時出現矛盾訊息 -->
      <div class="phone-hint" :class="phase">
        <template v-if="phase === 'correct'">✓ 答對了！就是這個功能</template>
        <template v-else-if="phase === 'wrong'">再選一次，找出正確功能</template>
        <template v-else>👇 請點選正確的功能</template>
      </div>

      <!-- 3x3 功能九宮格（主要觸控區） -->
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

          <span class="tile-icon" :style="{ background: mod.color }">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="mod.iconSvg"
            ></svg>
          </span>
          <span class="tile-name">{{ mod.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { PHONE_MODULES } from '../data/phoneModules'
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
  background: #f1f7fd;
  border: 12px solid #0f172a;
  border-radius: 48px;
  box-shadow: 0 0 0 3px #38bdf8, 0 20px 48px rgba(2, 132, 199, 0.26);
  overflow: hidden;
}

.status-bar {
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(90deg, var(--c-brand-600), #1d4ed8);
}

.app-bar {
  height: 62px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  background: linear-gradient(90deg, var(--c-brand-600), #1d4ed8);
  color: #fff;
}

.app-bar-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fff;
}

.app-bar-name {
  font-size: 25px;
  font-weight: 900;
}

.phone-hint {
  flex-shrink: 0;
  margin: 14px 20px 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  font-size: 21px;
  font-weight: 900;
  color: var(--c-brand-700);
  background: var(--c-brand-100);
  transition: background 0.25s ease, color 0.25s ease;
}

.phone-hint.wrong {
  color: var(--c-retry-800);
  background: #fef3c7;
}

.phone-hint.correct {
  color: #fff;
  background: var(--c-success-500);
}

.modules-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 14px;
  padding: 16px 20px 22px;
}

/* 每格約 196 × 214 CSS px，遠大於 100 × 100 觸控下限 */
.module-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 6px;
  background: #fff;
  border: 2.5px solid #e2e8f0;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-soft);
  transition: transform 0.12s ease, opacity 0.28s ease, border-color 0.2s ease, background 0.2s ease;
}

/* 觸控按下回饋（不依賴 hover） */
.module-tile:active:not(:disabled) {
  transform: scale(0.95);
  background: var(--c-brand-50);
}

.module-tile:disabled {
  cursor: default;
}

.tile-icon {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 12px rgba(15, 23, 42, 0.15);
  pointer-events: none;
  flex-shrink: 0;
}

.tile-icon svg {
  width: 42px;
  height: 42px;
}

.tile-name {
  font-size: var(--fs-module);
  font-weight: 900;
  color: var(--c-ink-900);
  letter-spacing: -0.3px;
  white-space: nowrap;
  pointer-events: none;
}

/* 角標定位於按鈕內側右上角，不超出網格邊界 */
.tile-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  font-size: 14px;
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

/* 答錯：琥珀色外框＋輕微晃動，非大面積紅色警示 */
.module-tile.is-wrong {
  border-color: var(--c-retry-500);
  background: var(--c-retry-50);
  animation: softShake 0.38s ease-in-out;
}

.module-tile.is-tried {
  border-style: dashed;
  opacity: 0.72;
}

/* 答對：綠色外框＋光圈 */
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
</style>
