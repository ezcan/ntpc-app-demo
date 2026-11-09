<template>
  <div class="status-strip" :class="phase">
    <!-- 狀態 D：答對後的重置倒數 -->
    <template v-if="phase === 'correct'">
      <div class="countdown">
        <span class="cd-text">
          <strong>{{ countdown }}</strong> 秒後自動換下一位挑戰者，歡迎掃描左側 QR Code 下載 APP！
        </span>
        <div class="cd-track">
          <div class="cd-bar" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
      <button class="next-btn" @click="$emit('next')">下一位 ➔</button>
    </template>

    <template v-else>
      <span class="rule"><b>①</b> 看情境</span>
      <span class="sep" aria-hidden="true">›</span>
      <span class="rule"><b>②</b> 點手機功能</span>
      <span class="sep" aria-hidden="true">›</span>
      <span class="rule"><b>③</b> 認識校園通服務</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  phase: { type: String, required: true },
  countdown: { type: Number, default: 0 },
  total: { type: Number, default: 10 }
})

defineEmits(['next'])

const progress = computed(() => Math.max(0, Math.min(100, (props.countdown / props.total) * 100)))
</script>

<style scoped>
.status-strip {
  height: 74px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 14px 0 28px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-soft);
  border: 1.5px solid rgba(186, 230, 253, 0.8);
}

.rule {
  font-size: 21px;
  font-weight: 800;
  color: var(--c-ink-700);
}

.rule b {
  color: var(--c-brand-600);
}

.sep {
  font-size: 26px;
  color: #93c5fd;
}

.countdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cd-text {
  font-size: 19px;
  font-weight: 800;
  color: var(--c-ink-700);
}

.cd-text strong {
  font-size: 24px;
  color: var(--c-success-700);
}

.cd-track {
  height: 8px;
  border-radius: var(--r-pill);
  background: #d1fae5;
  overflow: hidden;
}

.cd-bar {
  height: 100%;
  background: var(--c-success-500);
  border-radius: var(--r-pill);
  transition: width 1s linear;
}

.next-btn {
  height: 50px;
  min-width: 156px;
  padding: 0 22px;
  border-radius: var(--r-sm);
  font-size: 21px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, var(--c-success-500), #0d9488);
  box-shadow: 0 6px 14px rgba(16, 185, 129, 0.28);
}

.next-btn:active {
  transform: scale(0.96);
}
</style>
