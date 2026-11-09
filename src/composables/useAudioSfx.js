import { ref } from 'vue'

/**
 * 展場專用原生 Web Audio API 互動音效合成引擎
 * 完全免外網、不依賴外部音檔，離線零延遲
 */
let audioCtx = null
const isSfxEnabled = ref(true)

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function useAudioSfx() {
  // 1. 點擊音效 (泡泡彈跳短音)
  function playTapSFX() {
    if (!isSfxEnabled.value) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(520, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // ignore audio context restriction errors
    }
  }

  // 2. 答對音效 (明亮大和弦琶音 + 勝利高音)
  function playCorrectSFX() {
    if (!isSfxEnabled.value) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09)

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.09)
        gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + idx * 0.09 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.28)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.09)
        osc.stop(ctx.currentTime + idx * 0.09 + 0.3)
      })
    } catch {
      // ignore
    }
  }

  // 3. 答錯音效 (柔和低音震盪兩下，不刺耳)
  function playWrongSFX() {
    if (!isSfxEnabled.value) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      ;[0, 0.12].forEach((delay) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, ctx.currentTime + delay)
        osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + delay + 0.1)

        gain.gain.setValueAtTime(0.16, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.1)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + delay)
        osc.stop(ctx.currentTime + delay + 0.1)
      })
    } catch {
      // ignore
    }
  }

  function toggleSFX() {
    playTapSFX()
    isSfxEnabled.value = !isSfxEnabled.value
  }

  function unlockAudio() {
    getAudioContext()
  }

  return {
    isSfxEnabled,
    playTapSFX,
    playCorrectSFX,
    playWrongSFX,
    toggleSFX,
    unlockAudio
  }
}

