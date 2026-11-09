<template>
  <header class="kiosk-header">
    <img :src="asset(footerLogo.src)" :alt="footerLogo.alt" class="org-logo" />
    <span class="divider" aria-hidden="true"></span>

    <div class="brand">
      <img :src="asset(info.logo)" alt="" class="app-icon" />
      <div class="brand-text">
        <div class="brand-line">
          <h1 class="app-name">{{ info.appName }}</h1>
          <span class="tagline">{{ info.tagline }}</span>
        </div>
        <p class="sub-title">{{ info.subTitle }}</p>
      </div>
    </div>

    <div class="header-right">
      <img :src="asset(award.src)" :alt="award.alt" class="award-img" />

      <button
        class="preview-toggle-btn"
        :class="{ active: showPreviewBar }"
        title="開啟／關閉筆電預覽測試工具列"
        @click="$emit('toggle-preview')"
      >
        <span>🖥</span>
        <span>預覽工具</span>
      </button>

      <button
        class="sfx-toggle"
        :aria-pressed="isSfxEnabled"
        :title="isSfxEnabled ? '關閉音效' : '開啟音效'"
        @click="toggleSFX"
      >
        {{ isSfxEnabled ? '🔔' : '🔕' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { KIOSK_INFO } from '../data/kioskInfo'
import { useAudioSfx } from '../composables/useAudioSfx'
import { asset } from '../utils/asset'

defineProps({
  showPreviewBar: { type: Boolean, default: false }
})

defineEmits(['toggle-preview'])

const info = KIOSK_INFO.header
const { award, footerLogo } = KIOSK_INFO
const { isSfxEnabled, toggleSFX } = useAudioSfx()
</script>

<style scoped>
.kiosk-header {
  height: 92px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  border: 1.5px solid rgba(186, 230, 253, 0.8);
}

.org-logo {
  height: 48px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.divider {
  width: 2px;
  height: 44px;
  background: var(--c-line);
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.app-icon {
  width: 58px;
  height: 58px;
  border-radius: 15px;
  box-shadow: var(--shadow-soft);
  flex-shrink: 0;
}

.brand-text {
  min-width: 0;
}

.brand-line {
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
}

.app-name {
  font-size: 32px;
  font-weight: 900;
  color: var(--c-brand-900);
  letter-spacing: -0.4px;
  line-height: 1.15;
}

.tagline {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--c-brand-500), var(--c-brand-600));
  padding: 4px 16px;
  border-radius: var(--r-pill);
}

.sub-title {
  margin-top: 3px;
  font-size: 17px;
  font-weight: 700;
  color: var(--c-brand-700);
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.award-img {
  height: 36px;
  width: auto;
}

.preview-toggle-btn {
  height: 42px;
  padding: 0 14px;
  border-radius: var(--r-pill);
  background: var(--c-brand-50);
  border: 1.5px solid var(--c-line);
  color: var(--c-brand-700);
  font-size: 15px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.preview-toggle-btn.active {
  background: var(--c-brand-900);
  border-color: var(--c-brand-900);
  color: #fff;
}

.sfx-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 20px;
  background: var(--c-brand-50);
  border: 1.5px solid var(--c-line);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
