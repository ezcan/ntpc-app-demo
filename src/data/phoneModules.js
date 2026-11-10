/**
 * 新北校園通 APP 手機 3x3 常用功能模組定義（排列順序即手機畫面順序）
 *
 * - name / sub：沿用 APP 既有功能名稱，請勿自行改寫專有名稱
 * - icon：對應 public/icons/ 下的原版 APP 圖示 PNG
 * - color：對應原版圖示主色調（用於外框強調與標籤點綴）
 * - desc：答錯時用來介紹「剛剛點到的功能」，接在「可以…」之後，內容取自既有題庫說明
 */
export const PHONE_MODULES = [
  {
    key: 'broadcast',
    name: '教育放送臺',
    sub: '即時推播',
    icon: 'icons/broadcast.png',
    color: '#2f80ed',
    tint: '#eff6ff',
    desc: '接收颱風停課通知與學校重要消息'
  },
  {
    key: 'leave',
    name: '上課 YO',
    sub: '線上請假',
    icon: 'icons/leave.png',
    color: '#f2a900',
    tint: '#fffbeb',
    desc: '線上幫孩子請假並即時通知導師'
  },
  {
    key: 'points',
    name: '揪 i 點',
    sub: '點數生活',
    icon: 'icons/points.png',
    color: '#ff758f',
    tint: '#fff1f2',
    desc: '查看參與校園任務累積的點數並兌換好康'
  },
  {
    key: 'health',
    name: '寶貝 i 健康',
    sub: '即時照護',
    icon: 'icons/health.png',
    color: '#d98cb3',
    tint: '#fdf2f8',
    desc: '掌握孩子在校的傷病處理與健康檢查紀錄'
  },
  {
    key: 'grades',
    name: '成績查詢',
    sub: '電子成績單',
    icon: 'icons/grades.png',
    color: '#ff6699',
    tint: '#fdf2f8',
    desc: '查看孩子的段考成績與歷年電子成績單'
  },
  {
    key: 'lunch',
    name: '午餐管理',
    sub: '即時菜單',
    icon: 'icons/lunch.png',
    color: '#84cc16',
    tint: '#f7fee7',
    desc: '查看營養午餐菜單與食材來源履歷'
  },
  {
    key: 'exchange',
    name: '多元兌換',
    sub: '超商兌領',
    icon: 'icons/exchange.png',
    color: '#3d85c6',
    tint: '#f0f9ff',
    desc: '出示手機條碼到超商兌領學幼童鮮奶等福利'
  },
  {
    key: 'tuition',
    name: '學費 pay',
    sub: '省紙首選',
    icon: 'icons/tuition.png',
    color: '#1abc9c',
    tint: '#ecfdf5',
    desc: '用手機線上繳納學雜費，免跑超商排隊'
  },
  {
    key: 'contact',
    name: '電子聯絡簿',
    sub: '親師互動',
    icon: 'icons/contact.png',
    color: '#6dbbe8',
    tint: '#f0f9ff',
    desc: '在手機上簽閱孩子的作業與老師叮嚀'
  }
]

// 手機底部導覽列「教育放送臺（未選取）」專用灰色圖示
export const BROADCAST_TAB_UNSELECTED_ICON = 'icons/broadcast-unselected.png'

export const MODULE_MAP = Object.fromEntries(PHONE_MODULES.map((m) => [m.key, m]))
