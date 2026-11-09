/**
 * 新北校園通 APP 手機 3x3 常用功能模組定義（排列順序即手機畫面順序）
 *
 * - name / sub：沿用 APP 既有功能名稱，請勿自行改寫專有名稱
 * - desc：答錯時用來介紹「剛剛點到的功能」，接在「可以…」之後，內容取自既有題庫說明
 * - iconSvg：24x24 viewBox 的 SVG 內容（stroke 樣式）
 */
export const PHONE_MODULES = [
  {
    key: 'broadcast',
    name: '教育放送臺',
    sub: '即時推播',
    color: '#06b6d4',
    desc: '接收颱風停課通知與學校重要消息',
    iconSvg: '<path d="M4.9 19.1A10 10 0 0 1 2 12a10 10 0 0 1 2.9-7.1M19.1 4.9A10 10 0 0 1 22 12a10 10 0 0 1-2.9 7.1M7.8 16.2A6 6 0 0 1 6 12a6 6 0 0 1 1.8-4.2M16.2 7.8A6 6 0 0 1 18 12a6 6 0 0 1-1.8 4.2M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>'
  },
  {
    key: 'leave',
    name: '上課 YO',
    sub: '線上請假',
    color: '#f59e0b',
    desc: '線上幫孩子請假並即時通知導師',
    iconSvg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
  },
  {
    key: 'points',
    name: '揪 i 點',
    sub: '點數生活',
    color: '#f43f5e',
    desc: '查看參與校園任務累積的點數並兌換好康',
    iconSvg: '<rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 8v14M3 12h18M12 3a3 3 0 0 0-3 3c0 1.5 3 2 3 2s3-.5 3-2a3 3 0 0 0-3-3z"/>'
  },
  {
    key: 'health',
    name: '寶貝 i 健康',
    sub: '即時照護',
    color: '#10b981',
    desc: '掌握孩子在校的傷病處理與健康檢查紀錄',
    iconSvg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'
  },
  {
    key: 'grades',
    name: '成績查詢',
    sub: '電子成績單',
    color: '#ec4899',
    desc: '查看孩子的段考成績與歷年電子成績單',
    iconSvg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/>'
  },
  {
    key: 'lunch',
    name: '午餐管理',
    sub: '即時菜單',
    color: '#84cc16',
    desc: '查看營養午餐菜單與食材來源履歷',
    iconSvg: '<path d="M18 2v20M6 2v20M2 7h8a4 4 0 0 1-4 4 4 4 0 0 1-4-4z"/>'
  },
  {
    key: 'exchange',
    name: '多元兌換',
    sub: '超商兌領',
    color: '#6366f1',
    desc: '出示手機條碼到超商兌領學幼童鮮奶等福利',
    iconSvg: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 11v2M13 17v2"/>'
  },
  {
    key: 'tuition',
    name: '學費 pay',
    sub: '省紙首選',
    color: '#059669',
    desc: '用手機線上繳納學雜費，免跑超商排隊',
    iconSvg: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'
  },
  {
    key: 'contact',
    name: '電子聯絡簿',
    sub: '親師互動',
    color: '#a855f7',
    desc: '在手機上簽閱孩子的作業與老師叮嚀',
    iconSvg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
  }
]

export const MODULE_MAP = Object.fromEntries(PHONE_MODULES.map((m) => [m.key, m]))
