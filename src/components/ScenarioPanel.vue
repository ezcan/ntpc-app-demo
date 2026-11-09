<template>
  <section class="scenario-panel">
    <!-- 第一層：生活情境題目（精準單行～雙行，把主要垂直空間讓給 16:9 大影片） -->
    <div class="question-block">
      <div class="q-top-bar">
        <span class="q-badge">💡 生活情境題</span>
        <span v-if="videoUrl" class="q-media-pill">🎬 情境動畫播放中</span>
      </div>
      <p class="q-scene">{{ quest.scene }}</p>
      <h2 class="q-ask">{{ quest.ask }}</h2>
    </div>

    <!-- 上下兩欄配置：上欄 16:9 大尺寸影片舞台（面積放大 4 倍）＋ 下欄橫向回饋提示卡 -->
    <div class="media-stack">
      <!-- 上欄：16:9 大畫面影片／插圖舞台（絕對定位鎖定，載入不跑版） -->
      <div class="media-box">
        <!-- 底層：插圖柔焦襯底與無影片時的備援畫面 -->
        <div
          class="media-sprite-backdrop"
          :style="{ backgroundImage: `url(${spriteUrl})`, backgroundPosition: quest.spritePos }"
          aria-hidden="true"
        ></div>

        <div
          v-if="!videoUrl"
          class="media-sprite-main"
          :style="{ backgroundImage: `url(${spriteUrl})`, backgroundPosition: quest.spritePos }"
          role="img"
          :aria-label="quest.scene"
        ></div>

        <!-- 頂層：16:9 影片播放層（完美貼合 848×477 的 16:9 舞台） -->
        <video
          v-if="videoUrl"
          ref="videoRef"
          :key="quest.id"
          class="media-video"
          :class="{ ready: isVideoReady }"
          :src="videoUrl"
          :muted="isVideoMuted"
          autoplay
          loop
          playsinline
          webkit-playsinline
          preload="auto"
          @loadeddata="onVideoLoaded"
        ></video>

        <div v-if="videoUrl" class="video-controls">
          <button
            class="video-ctrl-btn"
            :aria-pressed="!isVideoMuted"
            @click="toggleMute"
          >
            {{ isVideoMuted ? '🔇 開啟聲音' : '🔊 聲音播放中' }}
          </button>
          <button
            class="video-ctrl-btn icon-only"
            title="重播影片"
            @click="replayVideo"
          >
            ↻
          </button>
        </div>
      </div>

      <!-- 下欄：橫向答題回饋與提示區（固定高度，A/B/C 三態原地切換不位移） -->
      <div class="feedback-row">
        <FeedbackCard
          :phase="phase"
          :quest="quest"
          :wrong-module="wrongModule"
          :answer-module="answerModule"
          :wrong-pulse="wrongPulse"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import FeedbackCard from './FeedbackCard.vue'
import { useVideoCache } from '../composables/useVideoCache'
import { asset } from '../utils/asset'

const props = defineProps({
  phase: { type: String, required: true },
  quest: { type: Object, required: true },
  wrongModule: { type: Object, default: null },
  answerModule: { type: Object, required: true },
  wrongPulse: { type: Number, default: 0 }
})

const spriteUrl = asset('插入圖片.jpg')
const videoRef = ref(null)
const isVideoReady = ref(false)
const { blobUrlMap, isVideoMuted, preloadQuestVideo, safeAutoPlay, toggleVideoMute } = useVideoCache()

// 只有影片已快取為 Blob 時才使用影片；否則顯示原有情境插圖
const videoUrl = computed(() => blobUrlMap[props.quest.id] || '')

function onVideoLoaded() {
  isVideoReady.value = true
  if (videoRef.value) safeAutoPlay(videoRef.value)
}

function replayVideo() {
  if (!videoRef.value) return
  videoRef.value.currentTime = 0
  safeAutoPlay(videoRef.value)
}

function toggleMute() {
  toggleVideoMute()
  if (videoRef.value) {
    videoRef.value.muted = isVideoMuted.value
    safeAutoPlay(videoRef.value)
  }
}

watch(
  () => props.quest.id,
  async () => {
    isVideoReady.value = false
    await preloadQuestVideo(props.quest)
    await nextTick()
    if (videoRef.value) {
      videoRef.value.currentTime = 0
      safeAutoPlay(videoRef.value)
    }
  },
  { immediate: true }
)

watch(videoUrl, async (newUrl) => {
  if (newUrl) {
    isVideoReady.value = false
    await nextTick()
    if (videoRef.value) {
      videoRef.value.load()
      safeAutoPlay(videoRef.value)
    }
  }
})
</script>

<style scoped>
.scenario-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 28px 22px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  border: 1.5px solid rgba(186, 230, 253, 0.8);
  overflow: hidden;
}

.question-block {
  flex-shrink: 0;
}

.q-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.q-badge {
  display: inline-flex;
  align-items: center;
  font-size: 18px;
  font-weight: 900;
  color: var(--c-brand-700);
  background: var(--c-brand-100);
  padding: 4px 16px;
  border-radius: var(--r-pill);
}

.q-media-pill {
  font-size: 15px;
  font-weight: 800;
  color: #0369a1;
  background: #f0f9ff;
  border: 1.5px solid #bae6fd;
  padding: 4px 14px;
  border-radius: var(--r-pill);
}

.q-scene {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--c-ink-700);
}

.q-ask {
  margin-top: 4px;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.28;
  letter-spacing: -0.4px;
  color: var(--c-ink-900);
}

/* 上下兩欄 Grid：上欄 1fr (約 848×470，接近完美 16:9)，下欄固定 164px */
.media-stack {
  margin-top: 14px;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) 164px;
  gap: 14px;
}

.media-box {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  border-radius: var(--r-md);
  overflow: hidden;
  background: #0f172a;
  border: 2.5px solid var(--c-line);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.1);
}

/* 柔焦氛圍背景，讓 1:1 插圖或 16:9 影片邊緣自然融合 */
.media-sprite-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: 300% 300%;
  background-repeat: no-repeat;
  filter: blur(26px) brightness(0.72) saturate(1.25);
  transform: scale(1.18);
  opacity: 0.85;
}

/* 尚未放影片時的 1:1 插圖主體：置中完整顯示於寬舞台中央 */
.media-sprite-main {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 92%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  border-radius: 18px;
  background-color: #ffffff;
  background-size: 300% 300%;
  background-repeat: no-repeat;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.28);
  border: 3px solid #ffffff;
  z-index: 1;
}

/* 16:9 影片：直接填滿 16:9 舞台 */
.media-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
}

.media-video.ready {
  opacity: 1;
}

.video-controls {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.video-ctrl-btn {
  height: 40px;
  padding: 0 14px;
  border-radius: var(--r-pill);
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.video-ctrl-btn.icon-only {
  width: 40px;
  padding: 0;
  font-size: 18px;
}

.feedback-row {
  min-width: 0;
  min-height: 0;
  height: 100%;
}
</style>
