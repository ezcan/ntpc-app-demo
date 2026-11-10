<template>
  <div class="feedback-slot" :class="phase">
    <!-- 狀態 A：等待作答 — 橫向簡潔操作提示，將主視覺讓給上方大影片 -->
    <div v-if="phase === 'waiting'" key="waiting" class="fb fb-waiting">
      <div class="waiting-left">
        <span class="hand" aria-hidden="true">👉</span>
        <div class="waiting-text">
          <p class="fb-title">請點選右側手機中的正確功能圖示</p>
          <p class="fb-note">看完上方情境後，直接觸碰右側手機九宮格即可作答（答錯可重新選擇）</p>
        </div>
      </div>
      <div class="arrow-row" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>

    <!-- 狀態 B：回答錯誤 — 橫向雙區：左側點選的功能介紹 ＋ 右側重新引導提問 -->
    <div
      v-else-if="phase === 'wrong' && wrongModule"
      :key="`wrong-${wrongPulse}`"
      class="fb fb-wrong"
    >
      <div class="wrong-main">
        <div class="fb-head">
          <span class="fb-badge retry" aria-hidden="true">?</span>
          <span class="fb-title">再想想看！</span>
          <span class="module-chip" :style="{ '--chip': wrongModule.color }">
            <img :src="asset(wrongModule.icon)" :alt="wrongModule.name" class="chip-icon-img" />
            {{ wrongModule.name }}
          </span>
        </div>
        <p class="fb-body">
          「{{ wrongModule.name }}」可以用來{{ wrongModule.desc }}。
          <strong class="ask-inline">不過，{{ quest.askHint }}</strong>
        </p>
      </div>

      <div class="wrong-side">
        <span class="retry-pill">請再點選右側手機試試看 ➔</span>
      </div>
    </div>

    <!-- 狀態 C：回答正確 — 橫向三區：答對功能標章 ＋ 功能生活化說明 ＋ 官方實績數據 -->
    <div v-else-if="phase === 'correct'" key="correct" class="fb fb-correct">
      <div class="correct-left" :style="{ '--chip': answerModule.color }">
        <span class="answer-icon" :style="{ background: answerModule.tint }">
          <img :src="asset(answerModule.icon)" :alt="answerModule.name" class="answer-icon-img" />
        </span>
        <div class="correct-title-group">
          <span class="correct-tag">✓ 答對了！</span>
          <span class="answer-name">{{ answerModule.name }}</span>
        </div>
      </div>

      <p class="fb-body correct-body">{{ quest.answer }}</p>

      <div class="stat-chip">
        <span>📊 {{ quest.stat.label }}</span>
        <strong>{{ quest.stat.value }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { asset } from '../utils/asset'

defineProps({
  phase: { type: String, required: true },
  quest: { type: Object, required: true },
  wrongModule: { type: Object, default: null },
  answerModule: { type: Object, required: true },
  wrongPulse: { type: Number, default: 0 }
})
</script>

<style scoped>
.feedback-slot {
  height: 100%;
  width: 100%;
  border-radius: var(--r-md);
  border: 2.5px solid transparent;
  overflow: hidden;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.feedback-slot.waiting {
  background: var(--c-brand-50);
  border-color: var(--c-line);
}

.feedback-slot.wrong {
  background: var(--c-retry-50);
  border-color: #fcd34d;
}

.feedback-slot.correct {
  background: var(--c-success-50);
  border-color: var(--c-success-500);
}

.fb {
  height: 100%;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  animation: popIn 0.25s ease-out;
}

/* ---------- 狀態 A：等待作答（橫向） ---------- */
.waiting-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.hand {
  font-size: 46px;
  animation: floatHop 1.6s ease-in-out infinite;
  flex-shrink: 0;
}

.waiting-text .fb-title {
  font-size: 28px;
  font-weight: 900;
  color: var(--c-brand-700);
  line-height: 1.25;
}

.waiting-text .fb-note {
  margin-top: 6px;
  font-size: 19px;
  font-weight: 700;
  color: var(--c-ink-500);
}

.arrow-row {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  padding-right: 8px;
}

.arrow-row span {
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 18px solid var(--c-brand-500);
  animation: arrowBlink 1.2s infinite;
}

.arrow-row span:nth-child(2) { animation-delay: 0.2s; }
.arrow-row span:nth-child(3) { animation-delay: 0.4s; }

@keyframes arrowBlink {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}

/* ---------- 狀態 B：回答錯誤（橫向） ---------- */
.fb-wrong {
  animation: popIn 0.22s ease-out, softShake 0.38s ease-in-out 0.22s;
}

.wrong-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fb-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fb-badge {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
}

.fb-badge.retry { background: var(--c-retry-500); }

.fb-wrong .fb-title {
  font-size: 26px;
  font-weight: 900;
  color: var(--c-retry-800);
}

.module-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 3px 14px 3px 8px;
  border-radius: var(--r-pill);
  background: #fff;
  border: 2px solid var(--chip);
  font-size: 20px;
  font-weight: 900;
  color: var(--c-ink-900);
}

.chip-icon-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  display: block;
}

.fb-body {
  font-size: 21px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--c-ink-700);
}

.ask-inline {
  color: var(--c-brand-700);
  font-weight: 900;
}

.wrong-side {
  flex-shrink: 0;
}

.retry-pill {
  display: inline-flex;
  align-items: center;
  padding: 12px 18px;
  border-radius: var(--r-sm);
  background: #fef3c7;
  border: 1.5px solid #f59e0b;
  color: var(--c-retry-800);
  font-size: 18px;
  font-weight: 900;
  white-space: nowrap;
}

/* ---------- 狀態 C：回答正確（橫向） ---------- */
.correct-left {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 18px;
  background: #ffffff;
  border-radius: var(--r-sm);
  border: 2px solid #a7f3d0;
  flex-shrink: 0;
}

.answer-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
  flex-shrink: 0;
  animation: pulseRing 1.2s ease-out 2;
}

.answer-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.correct-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.correct-tag {
  font-size: 17px;
  font-weight: 900;
  color: var(--c-success-700);
}

.answer-name {
  font-size: 26px;
  font-weight: 900;
  color: var(--c-ink-900);
  white-space: nowrap;
}

.correct-body {
  flex: 1;
  min-width: 0;
  font-size: 21px;
  line-height: 1.48;
}

.stat-chip {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  padding: 12px 18px;
  border-radius: var(--r-sm);
  background: #fff;
  border: 2px solid #a7f3d0;
  font-size: 16px;
  font-weight: 800;
  color: var(--c-ink-500);
  white-space: nowrap;
}

.stat-chip strong {
  font-size: 24px;
  font-weight: 900;
  color: var(--c-success-700);
}
</style>
