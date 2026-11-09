/**
 * 展場品牌與下載資訊（第四層資訊：保留但不干擾操作）
 * 圖片路徑皆相對於 public/ 目錄
 */
export const KIOSK_INFO = {
  header: {
    logo: 'icon.png',
    appName: '新北校園通 APP',
    tagline: '生活情境互動體驗',
    subTitle: '點選正確功能，認識校園通的貼心服務'
  },
  download: {
    title: '下載',
    appName: '新北校園通 APP',
    qr: 'QR.png', // 官方實際下載 QR Code，請勿替換為其他圖片
    platforms: ['iOS', 'Android'],
    ratings: [
      { label: 'App Store', score: '4.7' },
      { label: 'Google Play', score: '4.3' }
    ],
    // 答對後強化下載引導的文案
    successCta: '掃描下載，馬上就能用！'
  },
  mascot: 'ton.png',
  award: { src: 'aiexcelent-2026.png', alt: '2026 臺灣 AI 卓越獎' },
  footerLogo: { src: 'aiedu.png', alt: '新北市政府教育局' }
}
