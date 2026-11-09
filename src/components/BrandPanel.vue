<template>
  <aside class="brand-panel" :class="{ highlight }">
    <div class="download-title">
      <span class="dl-small">{{ dl.title }}</span>
      <span class="dl-name">{{ dl.appName }}</span>
    </div>

    <div class="qr-box">
      <img :src="asset(dl.qr)" alt="新北校園通 APP 下載 QR Code" />
    </div>

    <!-- 答對後強化下載引導；其他狀態只顯示平台資訊 -->
    <p v-if="highlight" class="success-cta">📱 {{ dl.successCta }}</p>
    <div v-else class="platforms">
      <span v-for="p in dl.platforms" :key="p" class="platform-pill">{{ p }}</span>
    </div>

    <ul class="ratings">
      <li v-for="r in dl.ratings" :key="r.label">
        <span>{{ r.label }}</span>
        <strong>★ {{ r.score }}</strong>
      </li>
    </ul>

    <img :src="asset(mascot)" alt="小通" class="mascot" />
  </aside>
</template>

<script setup>
import { KIOSK_INFO } from '../data/kioskInfo'
import { asset } from '../utils/asset'

defineProps({
  highlight: { type: Boolean, default: false }
})

const dl = KIOSK_INFO.download
const mascot = KIOSK_INFO.mascot
</script>

<style scoped>
.brand-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px 18px 0;
  background: linear-gradient(180deg, var(--c-brand-600) 0%, var(--c-brand-500) 100%);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  color: #fff;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.brand-panel.highlight {
  box-shadow: 0 0 0 5px #fde047, var(--shadow-card);
}

.download-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.25;
  width: 100%;
}

.dl-small {
  font-size: 20px;
  font-weight: 800;
  opacity: 0.92;
}

.dl-name {
  font-size: 24px;
  font-weight: 900;
  white-space: nowrap;
  margin-top: 2px;
}

.qr-box {
  margin-top: 14px;
  width: 176px;
  height: 176px;
  padding: 10px;
  background: #fff;
  border-radius: var(--r-sm);
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(12, 58, 107, 0.18);
}

.qr-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.platforms {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.platform-pill {
  font-size: 16px;
  font-weight: 800;
  padding: 5px 14px;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.22);
}

.success-cta {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 900;
  text-align: center;
  line-height: 1.3;
  color: var(--c-brand-900);
  background: #fde047;
  padding: 8px 12px;
  border-radius: var(--r-sm);
  width: 100%;
  animation: popIn 0.3s ease-out;
}

.ratings {
  list-style: none;
  margin-top: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ratings li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  white-space: nowrap;
}

.ratings strong {
  color: #fde047;
  font-weight: 900;
}

.mascot {
  margin-top: auto;
  width: 136px;
  height: auto;
  object-fit: contain;
  animation: floatHop 2.4s ease-in-out infinite;
}
</style>
