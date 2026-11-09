/**
 * 新北校園通 APP 九大功能 — 生活情境題庫（每位民眾只作答一題，每輪隨機抽一題）
 *
 * 欄位說明：
 * - scene     ：情境描述（題目第一行，精簡自原題，不改題意）
 * - ask       ：提問句（題目第二行）
 * - askHint   ：答錯時的引導提問，不揭露答案（例：「請假應該使用哪個功能呢？」）
 * - answer    ：答對時的功能說明，1～3 句生活化語言
 * - stat      ：官方累計實績（答對後顯示，數據沿用原專案）
 * - spritePos ：插入圖片.jpg 九宮格裁切位置（無影片時的情境插圖）
 * - videoSrc  ：情境影片（放入 public/videos/ 後自動啟用）
 *
 * 原始完整題目保留於 originalTitle，方便核對題意。
 */
export const KIOSK_QUESTS = [
  {
    id: 'tuition',
    targetKey: 'tuition',
    scene: '開學收到學校繳費單，不想跑超商或銀行排隊。',
    ask: '要用哪個功能，直接在手機上繳學費？',
    askHint: '線上繳學費應該使用哪個功能呢？',
    answer: '使用「學費 pay」就能在手機上線上繳納學雜費，不必帶現金排隊，收據也會留存在雲端。',
    stat: { label: '累計線上繳費', value: '1,034 萬次' },
    spritePos: '0% 0%',
    videoSrc: 'videos/tuition.mp4',
    originalTitle: '開學收到了學校的繳費單，我不想跑超商或銀行排隊，想直接用手機線上秒刷完成扣款，應該使用哪個功能？'
  },
  {
    id: 'leave',
    targetKey: 'leave',
    scene: '孩子今天早上發燒，需要請假休養。',
    ask: '要用哪個功能，快速線上請假並通知導師？',
    askHint: '請假應該使用哪個功能呢？',
    answer: '使用「上課 YO」即可線上請假，導師手機立即收到通知，還能掌握孩子的到離校動態。',
    stat: { label: '累計線上請假', value: '901 萬筆' },
    spritePos: '50% 0%',
    videoSrc: 'videos/leave.mp4',
    originalTitle: '今天早上孩子發燒不舒服需要休養，我上班快遲到了，想直接用手機幫孩子線上完成請假並通知導師，應該使用哪個功能？'
  },
  {
    id: 'points',
    targetKey: 'points',
    scene: '參加校園問卷、簽到和活動，累積了不少點數。',
    ask: '要用哪個功能，查看點數餘額與任務進度？',
    askHint: '查看點數應該使用哪個功能呢？',
    answer: '使用「揪 i 點」可以查看完成校園任務累積的點數，還能兌換超商 OP 點數等好康。',
    stat: { label: '累計發放點數', value: '1.38 億點' },
    spritePos: '100% 0%',
    videoSrc: 'videos/points.mp4',
    originalTitle: '我平時參與校園問卷、簽到與各項活動累積了不少點數，想隨時查看點數餘額與任務進度，應該使用哪個功能？'
  },
  {
    id: 'health',
    targetKey: 'health',
    scene: '孩子上體育課跌倒，去了一趟健康中心。',
    ask: '要用哪個功能，即時掌握擦藥處置與健康紀錄？',
    askHint: '掌握孩子在校的健康狀況應該使用哪個功能呢？',
    answer: '使用「寶貝 i 健康」，孩子在校受傷處理時家長會即時收到通知，健康檢查紀錄也能隨時查看。',
    stat: { label: '傷病即時通知', value: '170 萬筆+' },
    spritePos: '0% 50%',
    videoSrc: 'videos/health.mp4',
    originalTitle: '孩子在學校上體育課跌倒去了一趟健康中心，我想即時掌握他在校內擦藥處置與體溫身高紀錄，應該使用哪個功能？'
  },
  {
    id: 'grades',
    targetKey: 'grades',
    scene: '段考成績公布了，不想等孩子帶紙本成績單回家。',
    ask: '要用哪個功能，直接在手機上看成績？',
    askHint: '查看成績應該使用哪個功能呢？',
    answer: '使用「成績查詢」就能在手機上查看段考與歷年電子成績單，不怕紙本弄丟，也更環保。',
    stat: { label: '電子成績單下載', value: '256 萬次' },
    spritePos: '50% 50%',
    videoSrc: 'videos/grades.mp4',
    originalTitle: '段考結束成績公布了，我不想等孩子帶紙本成績單回家簽名，想直接用手機查看落點與歷年成績單，應該使用哪個功能？'
  },
  {
    id: 'lunch',
    targetKey: 'lunch',
    scene: '想知道孩子今天在學校吃得營不營養。',
    ask: '要用哪個功能，查看午餐菜色與食材履歷？',
    askHint: '查看營養午餐應該使用哪個功能呢？',
    answer: '使用「午餐管理」可以即時查看今天的營養午餐菜單與食材來源履歷，吃得安心看得見。',
    stat: { label: '午餐查詢次數', value: '250 萬次+' },
    spritePos: '100% 50%',
    videoSrc: 'videos/lunch.mp4',
    originalTitle: '我很關心孩子今天在學校吃得營不營養，想即時查閱今天學校營養午餐的菜色照片與食材來源履歷，應該使用哪個功能？'
  },
  {
    id: 'exchange',
    targetKey: 'exchange',
    scene: '想帶孩子去超商兌領學幼童營養鮮奶。',
    ask: '要用哪個功能，出示手機條碼兌換？',
    askHint: '到超商兌領鮮奶應該使用哪個功能呢？',
    answer: '使用「多元兌換」，到四大超商出示手機條碼就能兌領鮮奶，不用帶實體卡片。',
    stat: { label: '累計兌領', value: '640 萬人次+' },
    spritePos: '0% 100%',
    videoSrc: 'videos/exchange.mp4',
    originalTitle: '我想帶孩子拿手機數位條碼去超商兌領學幼童營養鮮奶，應該使用哪個功能？'
  },
  {
    id: 'contact',
    targetKey: 'contact',
    scene: '下班回家後，想看看孩子今天的作業和老師叮嚀。',
    ask: '要用哪個功能，直接在手機上簽閱？',
    askHint: '簽閱作業與老師叮嚀應該使用哪個功能呢？',
    answer: '使用「電子聯絡簿」就能在手機上簽閱作業與老師叮嚀，不怕孩子忘記帶聯絡簿回家。',
    stat: { label: '作業發送', value: '30 萬筆+' },
    spritePos: '50% 100%',
    videoSrc: 'videos/contact.mp4',
    originalTitle: '每天下班回家後，我想透過手機線上直接簽閱孩子今天的家庭作業指派事項與校園重要叮嚀，應該使用哪個功能？'
  },
  {
    id: 'broadcast',
    targetKey: 'broadcast',
    scene: '颱風天風雨越來越大，想知道明天有沒有停課。',
    ask: '要用哪個功能，第一時間收到官方通知？',
    askHint: '接收停課通知應該使用哪個功能呢？',
    answer: '使用「教育放送臺」，颱風停課與學校重要消息都會第一時間推播到手機。',
    stat: { label: '推播點閱', value: '1,463 萬次' },
    spritePos: '100% 100%',
    videoSrc: 'videos/broadcast.mp4',
    originalTitle: '颱風天風雨越來越大，我和孩子急著想知道新北市明天到底有沒有停班停課，想零時差接收官方推播，應該使用哪個功能？'
  }
]
