/**
 * 展場互動時間設定（秒）
 * 依現場人流可直接調整，不需修改元件程式
 */
export const GAME_CONFIG = {
  // 答對後保留功能介紹畫面的秒數，倒數結束自動換下一位
  resultSeconds: 10,
  // 答對畫面中，民眾若觸碰螢幕（例如正在掃 QR Code），倒數至少保留的秒數
  resultTouchExtendSeconds: 6,
  // 已答錯但無人繼續操作時，自動重置的秒數（代表民眾已離開）
  wrongIdleSeconds: 30,
  // 待機中完全無人操作時，自動換一道題目吸引路人的秒數
  waitingIdleSeconds: 90
}

