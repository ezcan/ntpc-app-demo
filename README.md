# 新北校園通 APP｜85 吋展場互動遊戲（Vue 3 重構與 UI/UX 優化版）

本專案為台灣教育科技展「新北校園通 APP」85 吋大型觸控螢幕（1920 × 1080, 16:9）互動體驗遊戲。以 **Vue 3 + Vite** 進行關注點分離架構重構，並針對大型展場觸控情境（遠距可讀性、單題體驗流程、答錯學習回饋、影片零延遲快取與自動播放）完成全面 UI/UX 優化。

---

## 一、 專案目錄結構（關注點分離）

```text
├── public/
│   ├── videos/                  # 題目情境影片目錄（放入 .mp4 即自動啟用快取播放）
│   ├── back-1920.jpg            # 展場 1920×1080 最佳化背景圖
│   ├── icon.png                 # 新北校園通 APP 圖示
│   ├── ton.png                  # 吉祥物「小通」
│   ├── QR.png                   # 官方實際下載 QR Code
│   ├── aiedu.png                # 新北市政府教育局標誌
│   ├── aiexcelent-2026.png      # 2026 臺灣 AI 卓越獎標章
│   └── 插入圖片.jpg              # 九宮格情境手繪插圖（無影片時的備援與柔焦背景）
├── src/
│   ├── assets/styles/
│   │   └── main.css             # 全域設計系統（Design Tokens、色票、圓角、字級階層）
│   ├── data/                    # 【資料層】
│   │   ├── quests.js            # 9 道生活情境題庫、提問引導、功能說明、影片路徑
│   │   ├── phoneModules.js      # 手機 3×3 功能模組定義、配色、SVG 圖示與用途說明
│   │   ├── kioskInfo.js         # 品牌標題、下載 QR Code 與評分資訊
│   │   └── gameConfig.js        # 展場倒數秒數與閒置自動重置時間設定
│   ├── composables/             # 【狀態與服務層】
│   │   ├── useGameFlow.js       # 單題體驗狀態機（waiting / wrong / correct / 自動重置）
│   │   ├── useVideoCache.js     # CacheStorage + Memory Blob URL 雙層影片預載快取引擎
│   │   ├── useAudioSfx.js       # Web Audio API 離線零延遲合成音效
│   │   └── useConfetti.js       # 克制型過關彩帶粒子特效
│   ├── components/              # 【UI 元件層】
│   │   ├── KioskHeader.vue      # 頂部品牌橫幅、預覽工具切換與音效開關
│   │   ├── BrandPanel.vue       # 左側（13%）：APP 下載 QR Code、評分與吉祥物小通
│   │   ├── ScenarioPanel.vue    # 中央（48.5%）：生活情境題、固定比例影片／插圖容器
│   │   ├── FeedbackCard.vue     # 中央右側：等待提示／答錯功能介紹／答對功能解析卡
│   │   ├── StatusStrip.vue      # 中央底部：三步驟操作指引與過關重置倒數條
│   │   └── PhoneMockup.vue      # 右側（36.5%）：新北校園通擬真手機與 3×3 大觸控按鈕
│   ├── utils/
│   │   └── asset.js             # 靜態資源路徑輔助函式
│   ├── App.vue                  # 1920×1080 固定舞台等比縮放與筆電預覽工具列
│   └── main.js                  # Vue 3 應用程式入口
└── legacy/                      # 原始 V13.html 備份
```

---

## 二、 啟動與打包指令

```bash
# 1. 安裝相依套件
npm install

# 2. 啟動開發伺服器（支援熱更新）
npm run dev

# 3. 打包展場正式環境版本（輸出至 dist/）
npm run build

# 4. 本機預覽正式打包結果
npm run preview
```

---

## 三、 放置題目影片方式

將 9 道題目的 `.mp4` 影片（建議 `H.264 / avc1` 編碼）放入 [`public/videos/`](./public/videos/README.md)，並依對應 `id` 命名：

| 題號 | 功能名稱 | 對應影片路徑 |
| :---: | :--- | :--- |
| 1 | 學費 pay | `public/videos/tuition.mp4` |
| 2 | 上課 YO | `public/videos/leave.mp4` |
| 3 | 揪 i 點 | `public/videos/points.mp4` |
| 4 | 寶貝 i 健康 | `public/videos/health.mp4` |
| 5 | 成績查詢 | `public/videos/grades.mp4` |
| 6 | 午餐管理 | `public/videos/lunch.mp4` |
| 7 | 多元兌換 | `public/videos/exchange.mp4` |
| 8 | 電子聯絡簿 | `public/videos/contact.mp4` |
| 9 | 教育放送臺 | `public/videos/broadcast.mp4` |

> **備註**：尚未放入影片的題目會自動顯示原有手繪情境插圖；放入影片後重新整理或切換題目即可自動載入快取並循環播放。

