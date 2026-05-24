/*
  =============================================
  Learning English - app.js
  Learning English 2 — メインアプリ
  =============================================
*/

const SET_SIZE    = 10;
const STORAGE_KEY = 'le2_v1';

/* =============================================
   ストリーク達成トースト
   ============================================= */

// ストリーク数に応じたメッセージ定義
function getStreakToast(streak) {
  // 特定日数の特別メッセージ
  const special = {
    1:  { emoji: '🎉', title: '1日目の学習達成！',       msg: 'よくやった！今日から始まるよ！' },
    2:  { emoji: '✌️', title: '2日連続達成！',            msg: 'いいね！続けることが大事！' },
    3:  { emoji: '🔥', title: '3日連続達成中！',          msg: '習慣になってきたね。この調子！' },
    7:  { emoji: '⭐', title: '7日連続達成！',            msg: '1週間続いた！本物の継続力だ！' },
    10: { emoji: '🏆', title: '10日連続達成！',           msg: '周りと差がついてる。すごいぞ！' },
    14: { emoji: '💎', title: '2週間連続達成！',          msg: 'ここまで来たら止まれないね！' },
    21: { emoji: '🚀', title: '21日連続達成！',           msg: '習慣化完了！英語脳になってきた！' },
    30: { emoji: '👑', title: '30日連続達成！',           msg: '1ヶ月！あなたは本物の英語学習者だ！' },
    50: { emoji: '🌟', title: '50日連続達成！！',         msg: '半端ない継続力。尊敬する！' },
    100:{ emoji: '🦁', title: '100日連続達成！！！',      msg: 'レジェンド。もう誰も止められない！' },
  };
  if (special[streak]) return special[streak];

  // 5日刻みの褒めメッセージ
  if (streak % 5 === 0) {
    const fives = [
      { emoji: '💪', msg: '努力の天才だね！' },
      { emoji: '🔥', msg: 'この熱量、ずっと続けて！' },
      { emoji: '📈', msg: '着実に成長してるよ！' },
      { emoji: '🎯', msg: 'ブレない集中力、最高！' },
      { emoji: '✨', msg: '毎日の積み重ねが光ってる！' },
      { emoji: '🦅', msg: '誰にも追いつけないペースだ！' },
      { emoji: '💡', msg: 'もう英語が体に染み込んでる！' },
    ];
    const idx = Math.floor((streak / 5 - 1)) % fives.length;
    return { emoji: fives[idx].emoji, title: `${streak}日連続達成！`, msg: fives[idx].msg };
  }

  // 通常の達成（2・4・6・8・9日など）
  const normals = [
    { emoji: '🔥', msg: 'ストリーク継続中！' },
    { emoji: '💪', msg: '今日もやり切った！' },
    { emoji: '📖', msg: '毎日が英語力アップにつながる！' },
    { emoji: '⚡', msg: 'この勢い、止まらないで！' },
  ];
  return {
    emoji: normals[streak % normals.length].emoji,
    title: `${streak}日連続達成！`,
    msg:   normals[streak % normals.length].msg,
  };
}

// トースト表示（XP獲得後、その日初回のみ）
let _streakToastShown = false; // セッション内で1回だけ出す

function maybeShowStreakToast() {
  // その日の最初のXP獲得時だけ表示
  if (_streakToastShown) return;
  if (state.streak < 1) return;

  // todayStudied が false → true に変わった瞬間が初回
  // (この関数はtodayStudied=trueにした直後に呼ぶ)
  _streakToastShown = true;

  const toast = getStreakToast(state.streak);
  showStreakToast(toast.emoji, toast.title, toast.msg, state.streak);
}

function showStreakToast(emoji, title, msg, streak) {
  // 既存トーストがあれば消す
  const old = document.getElementById('streakToast');
  if (old) old.remove();

  // 特別感を出す閾値
  const isBig   = streak >= 7;
  const isLegend= streak >= 30;

  const el = document.createElement('div');
  el.id = 'streakToast';
  el.className = 'streak-toast' + (isBig ? ' streak-toast-big' : '') + (isLegend ? ' streak-toast-legend' : '');
  el.innerHTML = `
    <div class="streak-toast-inner">
      <div class="streak-toast-emoji">${emoji}</div>
      <div class="streak-toast-body">
        <div class="streak-toast-title">${title}</div>
        <div class="streak-toast-msg">${msg}</div>
      </div>
      <div class="streak-toast-flame">
        <i class="ti ti-flame"></i><strong>${streak}</strong>
      </div>
    </div>
    <div class="streak-toast-bar"></div>`;

  document.body.appendChild(el);

  // アニメーション：少し待ってスライドイン
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.classList.add('streak-toast-in'); });
  });

  // 4秒後にスライドアウト → 削除
  setTimeout(() => {
    el.classList.add('streak-toast-out');
    setTimeout(() => el.remove(), 500);
  }, 4000);

  // タップで即閉じ
  el.addEventListener('click', () => {
    el.classList.add('streak-toast-out');
    setTimeout(() => el.remove(), 500);
  });
}


/* セットごとのカラー＆キャッチコピー定義 */
const SET_META = [
  { color:'#FF9500', bg:'#FFF5E6', label:'超基本', desc:'まずここから！挨拶と基礎単語' },
  { color:'#FF9500', bg:'#FFF5E6', label:'超基本', desc:'自己紹介・よく使う名詞' },
  { color:'#FF9500', bg:'#FFF5E6', label:'超基本', desc:'道案内・場所を伝える' },
  { color:'#FF9500', bg:'#FFF5E6', label:'超基本', desc:'移動・交通・旅行のコツ' },
  { color:'#FF9500', bg:'#FFF5E6', label:'超基本', desc:'買い物・お金の表現' },
  { color:'#34C759', bg:'#EDFAF2', label:'基礎',   desc:'数字・時間・日付を覚える' },
  { color:'#34C759', bg:'#EDFAF2', label:'基礎',   desc:'食事・注文・レストラン' },
  { color:'#007AFF', bg:'#E8F0FF', label:'発展',   desc:'感情・体調を話せるように' },
  { color:'#007AFF', bg:'#E8F0FF', label:'発展',   desc:'仕事・日常シーンの表現' },
  { color:'#AF52DE', bg:'#F5EEFF', label:'土台完了', desc:'このレベルをクリアで土台完成！' },
];

// TOEIC 600 専用セットメタ（Set 1〜40）
const TOEIC_SET_META = [
  // 1〜10: 既存セット
  { color:'#FF6B00', bg:'#FFF3E8', label:'基本語彙①', icon:'ti-briefcase',     desc:'法律・欠員・重役・手続き' },
  { color:'#FF6B00', bg:'#FFF3E8', label:'基本語彙②', icon:'ti-star',          desc:'評判・戦略・義務・証拠' },
  { color:'#FF6B00', bg:'#FFF3E8', label:'基本語彙③', icon:'ti-box',           desc:'容量・収益・労働・苦情' },
  { color:'#E67E00', bg:'#FFF0DC', label:'動詞①',     icon:'ti-bolt',          desc:'同封・配布・制限・開発' },
  { color:'#E67E00', bg:'#FFF0DC', label:'動詞②',     icon:'ti-bolt',          desc:'拡大・保証・予想・収容' },
  { color:'#E67E00', bg:'#FFF0DC', label:'動詞③',     icon:'ti-bolt',          desc:'保護・順守・値する・保存' },
  { color:'#CC6B00', bg:'#FFEBD6', label:'形容詞①',   icon:'ti-adjustments',   desc:'熟練・徹底・楽観・礼儀' },
  { color:'#CC6B00', bg:'#FFEBD6', label:'副詞・表現', icon:'ti-language',      desc:'結局・以前・特徴的・義務' },
  { color:'#CC6B00', bg:'#FFEBD6', label:'その他①',   icon:'ti-sparkles',      desc:'紹介・名誉・余裕・人口' },
  { color:'#CC6B00', bg:'#FFEBD6', label:'その他②',   icon:'ti-sparkles',      desc:'交差点・公共料金・路面電車' },
  // 11〜20: 場面別
  { color:'#007AFF', bg:'#E8F2FF', label:'会議',       icon:'ti-users',         desc:'議題・採決・承認・休憩' },
  { color:'#007AFF', bg:'#E8F2FF', label:'採用・人事', icon:'ti-user-plus',     desc:'求人・面接・試用期間・福利厚生' },
  { color:'#007AFF', bg:'#E8F2FF', label:'出張・旅費', icon:'ti-plane',         desc:'旅費精算・日当・搭乗券' },
  { color:'#0062CC', bg:'#E0EEFF', label:'契約・法務', icon:'ti-file-text',     desc:'条項・署名・守秘義務・有効期間' },
  { color:'#0062CC', bg:'#E0EEFF', label:'財務・経理', icon:'ti-coin',          desc:'予算・請求書・利益・損失' },
  { color:'#0062CC', bg:'#E0EEFF', label:'顧客対応',   icon:'ti-headset',       desc:'問い合わせ・返金・クレーム' },
  { color:'#0050AA', bg:'#D8EAFF', label:'マーケティング', icon:'ti-chart-bar', desc:'ターゲット・競合・市場調査' },
  { color:'#0050AA', bg:'#D8EAFF', label:'物流・在庫', icon:'ti-truck',         desc:'在庫・配送・倉庫・関税' },
  { color:'#0050AA', bg:'#D8EAFF', label:'プロジェクト', icon:'ti-layout-list',   desc:'マイルストーン・進捗・スコープ' },
  { color:'#003E88', bg:'#D0E4FF', label:'メール文書', icon:'ti-mail',          desc:'添付・確認依頼・折り返し連絡' },
  // 21〜30: 専門場面
  { color:'#34C759', bg:'#E8FAF0', label:'製品・サービス', icon:'ti-device-laptop', desc:'仕様・耐久性・互換性・品保' },
  { color:'#34C759', bg:'#E8FAF0', label:'オフィス',   icon:'ti-building',      desc:'会議室・受付・備品・入館証' },
  { color:'#28A84A', bg:'#DDF5E8', label:'交渉・提案', icon:'ti-arrows-exchange',  desc:'見積もり・譲歩・折衷案・合意' },
  { color:'#28A84A', bg:'#DDF5E8', label:'IT・デジタル', icon:'ti-device-mobile', desc:'バックアップ・権限・クラウド' },
  { color:'#1E9240', bg:'#D4F0DF', label:'購買・調達', icon:'ti-shopping-cart', desc:'発注・仕入れ先・数量割引' },
  { color:'#1E9240', bg:'#D4F0DF', label:'プレゼン',   icon:'ti-presentation',  desc:'スライド・質疑応答・結論' },
  { color:'#157836', bg:'#C8EBD8', label:'銀行・金融', icon:'ti-credit-card',   desc:'振込・為替・不正取引・上限' },
  { color:'#157836', bg:'#C8EBD8', label:'研修・教育', icon:'ti-school',        desc:'新入社員研修・評価・習熟度' },
  { color:'#157836', bg:'#C8EBD8', label:'不動産',     icon:'ti-home',          desc:'賃貸契約・敷金・内見・解約' },
  { color:'#0E6429', bg:'#BCEACF', label:'医療・保険', icon:'ti-first-aid-kit',    desc:'健康保険・処方薬・専門医' },
  // 31〜40: 語彙強化
  { color:'#AF52DE', bg:'#F5EEFF', label:'動詞強化①',  icon:'ti-bolt',          desc:'確認・調整・評価・監督' },
  { color:'#AF52DE', bg:'#F5EEFF', label:'動詞強化②',  icon:'ti-bolt',          desc:'参加・提出・承認・修正' },
  { color:'#9B3FCB', bg:'#F0E5FF', label:'形容詞強化①', icon:'ti-adjustments',  desc:'包括的・柔軟・信頼・革新' },
  { color:'#9B3FCB', bg:'#F0E5FF', label:'形容詞強化②', icon:'ti-adjustments',  desc:'適切・必要不可欠・継続・効率' },
  { color:'#8730B8', bg:'#EBDAFF', label:'副詞・前置詞', icon:'ti-language',     desc:'〜に従って・〜に加えて・一方で' },
  { color:'#8730B8', bg:'#EBDAFF', label:'名詞強化①',   icon:'ti-book',         desc:'締め切り・方針・通知・成果物' },
  { color:'#7520A5', bg:'#E5D0FF', label:'名詞強化②',   icon:'ti-book',         desc:'収益性・説明責任・補助金・株主' },
  { color:'#7520A5', bg:'#E5D0FF', label:'フレーズ',    icon:'ti-message-circle', desc:'慣用表現・ビジネスフレーズ' },
  { color:'#7520A5', bg:'#E5D0FF', label:'接客・ホテル', icon:'ti-door-enter',    desc:'チェックイン・コンシェルジュ' },
  { color:'#6010A0', bg:'#DFC8FF', label:'総仕上げ',    icon:'ti-trophy',        desc:'全カテゴリ混合・最終確認' },
];


/* 単語帳選択シート */
function showAddToVocabSheet(jp, en, btnId) {
  _showVocabPickSheet([{ jp, en }], () => {
    const btn = document.getElementById(btnId);
    if (btn) { btn.innerHTML = '<i class="ti ti-check"></i> 追加済み'; btn.disabled = true; btn.style.opacity = '0.6'; }
  });
}

function _showVocabPickSheet(cards, onDone) {
  const decks = loadDecks();
  const old = document.getElementById('vocabPickOverlay');
  if (old) old.remove();
  const deckListHTML = decks.length === 0
    ? `<div class="vocab-pick-empty">まだ単語帳がありません<br><span style="font-size:12px;color:var(--text-tertiary)">単語帳画面から先に作成してください</span></div>`
    : decks.map(d => `
        <button class="vocab-pick-deck-btn" onclick="_addCardsToSelectedDeck('${d.id}')">
          <i class="ti ti-cards" style="color:var(--accent)"></i>
          <span>${esc(d.name)}</span>
          <span class="vocab-pick-count">${d.cards.length}語</span>
        </button>`).join('');
  const preview = cards.length === 1
    ? `<div class="vocab-pick-preview"><span class="vocab-pick-jp">${esc(cards[0].jp)}</span><span class="vocab-pick-en">${esc(cards[0].en)}</span></div>`
    : `<div class="vocab-pick-preview"><span class="vocab-pick-jp">${cards.length}件の間違えた問題</span></div>`;
  const overlay = document.createElement('div');
  overlay.id = 'vocabPickOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title"><i class="ti ti-cards" style="color:var(--accent)"></i> 追加する単語帳を選択</div>
      <div class="vocab-pick-adding">${preview}</div>
      <div class="vocab-pick-list">${deckListHTML}</div>
      <button class="vocab-cancel-btn" style="width:100%;margin-top:8px" onclick="_closeVocabPickSheet()">キャンセル</button>
    </div>`;
  overlay.addEventListener('click', _closeVocabPickSheet);
  overlay._pendingCards = cards;
  overlay._onDone       = onDone;
  document.body.appendChild(overlay);
}

function _closeVocabPickSheet() {
  const o = document.getElementById('vocabPickOverlay');
  if (o) o.remove();
}

function _addCardsToSelectedDeck(deckId) {
  const overlay = document.getElementById('vocabPickOverlay');
  if (!overlay) return;
  const cards  = overlay._pendingCards || [];
  const onDone = overlay._onDone;
  const decks  = loadDecks();
  const deck   = decks.find(d => d.id === deckId);
  if (!deck) return;
  let added = 0;
  cards.forEach(c => {
    const already = deck.cards.some(x => x.en === c.en && x.jp === c.jp);
    if (!already) { deck.cards.push({ en: c.en, jp: c.jp, known: false, addedAt: Date.now() }); added++; }
  });
  saveDecks(decks);
  _closeVocabPickSheet();
  const msg = added === 0 ? 'すでに追加済みです' : `${added}件を「${deck.name}」に追加しました`;
  _showMiniToast(msg);
  if (added > 0 && onDone) onDone();
}

function _showMiniToast(msg) {
  const old = document.getElementById('miniToast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.id = 'miniToast';
  el.className = 'mini-toast';
  el.innerHTML = `<i class="ti ti-check"></i> ${msg}`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('mini-toast-in')));
  setTimeout(() => { el.classList.add('mini-toast-out'); setTimeout(() => el.remove(), 400); }, 2500);
}
function getSetMeta(si, level) {
  if (level && level.isToeic) {
    if (level.id === 'toeic_700') {
      return (typeof TOEIC_SET_META_700 !== 'undefined' && TOEIC_SET_META_700[si])
        || { color:'#007AFF', bg:'#E8F2FF', label:'TOEIC 700', icon:'ti-certificate', desc:'TOEIC 700点頻出単語' };
    }
    return TOEIC_SET_META[si] || { color:'#FF9500', bg:'#FFF5E6', label:'TOEIC', icon:'ti-certificate', desc:'TOEIC頻出単語' };
  }
  return SET_META[si] || { color:'#8E8E93', bg:'#F2F2F7', label:'', desc:'' };
}

/* =============================================
   状態変数
   ============================================= */
let state;
// 学習モード
let currentLevel, currentSetIdx, pool, qIdx, score, answered, dotResults;
let study_mistakes = [];
// タイマー参照（互換）
let ta_timerID = null;
// 最短英会話モード
let cv_level, cv_pool, cv_idx, cv_score, cv_answered;
let cv_mistakes = [];
// フラッシュカードモード（TOEIC）
let tfc_idx = 0, tfc_flipped = false, tfc_results = [];

/* =============================================
   localStorage
   ============================================= */
function loadState() {
  let s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state = {
    xp:               s.xp || 0,
    totalXp:          s.totalXp || 0,
    medals:           s.medals || 0,
    weekStart:        s.weekStart || '',
    streak:           s.streak || 0,
    lastDate:         s.lastDate || '',
    todayStudied:     s.todayStudied || false,
    todayXp:          s.todayXp || 0,
    clearedSets:      s.clearedSets || {},
    startDate:        s.startDate || '',
    cefrLevel:        s.cefrLevel || '',
    masterWeekScore:  s.masterWeekScore || 0,
    masterWeekStart:  s.masterWeekStart || '',
  };

  // Master週間スコアのリセット（月曜0時）
  let thisMonday2 = getMondayStr();
  if (state.masterWeekStart && state.masterWeekStart !== thisMonday2) {
    state.masterWeekScore = 0;
    state.masterWeekStart = thisMonday2;
  }
  if (!state.masterWeekStart) state.masterWeekStart = thisMonday2;

  let today     = getTodayStr();
  let thisMonday = getMondayStr();

  // 週間XPのリセットチェック（月曜0時）
  if (state.weekStart && state.weekStart !== thisMonday) {
    // 先週10000XP以上達成していたらメダル付与
    if (state.xp >= 10000) {
      state.medals++;
    }
    state.xp        = 0;
    state.weekStart = thisMonday;
  }
  if (!state.weekStart) state.weekStart = thisMonday;

  // ストリークチェック
  if (state.lastDate && state.lastDate !== today) {
    let diff = Math.round((new Date(today) - new Date(state.lastDate)) / 86400000);
    if (diff > 1) state.streak = 0;
    state.todayStudied = false;
    state.todayXp      = 0;
  }
}

// 今週の月曜日をYYYY/MM/DD形式で返す
// 回答を正規化：句読点・プレースホルダー（○○〜~—-など）を除去して比較
// iPhone Safari対応の安全な日付パース
function parseSafeDate(dateStr) {
  const parts = dateStr.replace(/-/g, '/').split('/');
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
}

function normalizeAns(s) {
  return s
    .toLowerCase()
    .replace(/[○〇〜~—\-]+/g, '')   // プレースホルダー・ダッシュ類
    .replace(/[.!?,;:'"「」【】]/g, '') // 句読点
    .replace(/\s+/g, ' ')
    .trim();
}

// 間違えリストHTML生成（共通）
function buildMistakesHTML(mistakes) {
  if (!mistakes || mistakes.length === 0) return '';
  const items = mistakes.map((m, idx) => `
    <div class="mistake-item" id="mistake-item-${idx}">
      <div class="mistake-jp">${esc(m.jp)}</div>
      ${m.userAnswer ? `<div class="mistake-user">× ${esc(m.userAnswer)}</div>` : ''}
      <div class="mistake-en">
        ○ ${esc(m.en)}
        <button type="button" class="qst-speak-btn" data-speak="${esc(m.en)}">
          <i class="ti ti-volume"></i>
        </button>
      </div>
      <button type="button" class="mistake-add-btn" id="mistake-add-${idx}"
        data-jp="${esc(m.jp)}" data-en="${esc(m.en)}" data-btnid="mistake-add-${idx}">
        <i class="ti ti-cards"></i> 単語帳に追加
      </button>
    </div>`).join('');
  return `
    <div class="mistakes-section" id="mistakesSection">
      <div class="mistakes-title-row">
        <span><i class="ti ti-alert-circle"></i> 間違えた問題（${mistakes.length}）</span>
        <button type="button" class="mistake-add-all-btn" id="mistakeAddAllBtn">
          <i class="ti ti-cards"></i> 全て追加
        </button>
      </div>
      <div class="mistakes-list">${items}</div>
    </div>`;
}

document.addEventListener('click', function(e) {
  const speakBtn = e.target.closest('[data-speak]');
  if (speakBtn) { speakEnglish(speakBtn.dataset.speak); return; }
  const addBtn = e.target.closest('.mistake-add-btn[data-jp]');
  if (addBtn) {
    _showVocabPickSheet([{ jp: addBtn.dataset.jp, en: addBtn.dataset.en }], () => {
      addBtn.innerHTML = '<i class="ti ti-check"></i> 追加済み';
      addBtn.disabled = true; addBtn.style.opacity = '0.6';
    });
    return;
  }
  const addAllBtn = e.target.closest('#mistakeAddAllBtn');
  if (addAllBtn) {
    const section = document.getElementById('mistakesSection');
    if (!section) return;
    const cards = [...section.querySelectorAll('.mistake-add-btn[data-jp]')]
      .map(b => ({ jp: b.dataset.jp, en: b.dataset.en }));
    _showVocabPickSheet(cards, () => {
      section.querySelectorAll('.mistake-add-btn').forEach(b => {
        b.innerHTML = '<i class="ti ti-check"></i> 追加済み'; b.disabled = true; b.style.opacity = '0.6';
      });
      addAllBtn.innerHTML = '<i class="ti ti-check"></i> 追加済み';
      addAllBtn.disabled = true; addAllBtn.style.opacity = '0.6';
    });
    return;
  }
});

function setCefrLevel(lv) {
  state.cefrLevel = lv;
  saveState();
  showStats(); // 画面を更新
}

function getMondayStr() {
  let d   = new Date();
  let day = d.getDay(); // 0=日, 1=月 ...
  let diff = (day === 0) ? -6 : 1 - day; // 日曜なら-6、それ以外は月曜に戻す
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toLocaleDateString('ja-JP');
}

function saveState() {
  state.lastDate = getTodayStr();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Firebaseに週間XP・累積XP・メダルを同期
  if (window.FB2 && window.FB2.isRegistered()) {
    window.FB2.syncToFirebase(state.totalXp, state.xp, state.masterWeekScore || 0);
  }
}

function getTodayStr() {
  return new Date().toLocaleDateString('ja-JP');
}

/* =============================================
   ユーティリティ
   ============================================= */
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function isLevelCleared(lv) {
  return (state.clearedSets[lv.id] || []).length >= lv.sets.length;
}
function isLevelUnlocked(lv) {
  if (lv.isToeic) return true;          // TOEICは常に挑戦可能
  if (!lv.unlockNeeds) return true;
  // CEFR選択によるアンロック（段階的）
  const cefr = state.cefrLevel;
  if (cefr === 'B1' && lv.id === 'pre_intermediate') return true;
  if (cefr === 'B2' && (lv.id === 'pre_intermediate' || lv.id === 'intermediate')) return true;
  if (cefr === 'C1' && (lv.id === 'pre_intermediate' || lv.id === 'intermediate' || lv.id === 'upper_intermediate')) return true;
  if (cefr === 'C2' && (lv.id === 'pre_intermediate' || lv.id === 'intermediate' || lv.id === 'upper_intermediate' || lv.id === 'advanced')) return true;
  let prev = LEVELS.find(l => l.id === lv.unlockNeeds);
  return prev ? isLevelCleared(prev) : false;
}
function isSetCleared(lvId, si)  { return (state.clearedSets[lvId] || []).includes(si); }
function isSetUnlocked(lvId, si) { return si === 0 || isSetCleared(lvId, si - 1); }
function levelProgress(lv)       { return (state.clearedSets[lv.id] || []).length; }

function getLevelIcon(id) {
  const m = {
    elementary:        {bg:'var(--warning-bg)', color:'var(--warning-text)', icon:'ti-seedling'},
    pre_intermediate:  {bg:'var(--info-bg)',    color:'var(--info-text)',    icon:'ti-plant'},
    intermediate:      {bg:'var(--accent-light)',color:'var(--accent)',      icon:'ti-bolt'},
    upper_intermediate:{bg:'var(--success-bg)', color:'var(--success-text)',icon:'ti-star'},
    advanced:          {bg:'var(--danger-bg)',  color:'var(--danger-text)', icon:'ti-rocket'},
  };
  return m[id] || {bg:'var(--bg-secondary)',color:'var(--text-secondary)',icon:'ti-book'};
}

/* =============================================
   画面切り替え
   ============================================= */
function showScreen(id) {
  ['screenHome','screenSets','screenQuiz','screenResult','screenConvo','screenVocab','screenQuest','screenStats','screenRanking','screenFavorite','screenFriends'].forEach(s => {
    document.getElementById(s).style.display = (s === id) ? 'block' : 'none';
  });
  document.getElementById('topBar').style.display =
    id === 'screenQuest' ? 'none' : 'flex';
}

/* =============================================
   共通UI
   ============================================= */
function updateTopBar() {
  const streakEl = document.getElementById('streakNum');
  if (streakEl) streakEl.textContent = state.streak;
  document.getElementById('weekXpNum').textContent  = state.xp.toLocaleString();
  document.getElementById('totalXpNum').textContent = state.totalXp.toLocaleString();
  let medalPill = document.getElementById('medalPill');
  if (state.medals > 0) {
    document.getElementById('medalNum').textContent = state.medals;
    medalPill.style.display = 'flex';
  } else {
    medalPill.style.display = 'none';
  }
  // ストリークピル
  const sp = document.getElementById('streakPill');
  if (sp) {
    if (state.streak > 0) {
      sp.innerHTML = `<div class="streak-pill-fire"></div><span class="streak-pill-text">🔥 ${state.todayStudied ? state.streak + 1 : state.streak}日連続！</span>`;
      sp.style.display = 'inline-flex';
    } else {
      sp.style.display = 'none';
    }
  }
}

function updateClock() {
  let el = document.getElementById('statusTime');
  let n  = new Date();
  if (el) el.textContent = n.getHours() + ':' + String(n.getMinutes()).padStart(2,'0');

  // 月曜0時を跨いだらその場で週間XPをリセット
  const thisMonday = getMondayStr();
  if (state.weekStart && state.weekStart !== thisMonday) {
    if (state.xp >= 10000) state.medals++;
    state.xp        = 0;
    state.weekStart = thisMonday;
    saveState();
    updateTopBar();
  }
}

function grantXp(amount) {
  state.xp += amount;
  state.totalXp += amount;
  state.todayXp += amount;
  // 初回XP獲得時に学習開始日を記録
  if (!state.startDate) state.startDate = getTodayStr();
}

function updateReminder() {
  let rem = document.getElementById('reminderArea');
  if (!rem) return;
  let msg;
  if (state.todayXp >= 1000) {
    msg = 'よく頑張った！こんなもんじゃないよね？！ 🔥';
  } else if (state.todayStudied) {
    msg = '継続は力なり 💪';
  } else {
    msg = '今日まだ学習していません！一問やってみよう 💪';
  }
  rem.innerHTML = `<div class="reminder"><i class="ti ti-bell"></i><span>${msg}</span></div>`;
}

/* =============================================
   ホーム画面
   ============================================= */
function showHome() {
  // タイマーが残っていたら止める
  if (ta_timerID) { clearInterval(ta_timerID); ta_timerID = null; }

  showScreen('screenHome');
  updateTopBar();
  updateReminder();

  // 学習開始日・経過日数の計算
  const MILESTONES       = [10,30,50,100,200,300,400,500,600,700,800,900,1000,
    1100,1200,1300,1400,1500,1600,1700,1800,1900,2000];
  const MILESTONES_GREEN = [2, 3];
  let elapsedDays  = 0;
  let isMilestone  = false;
  let isGreen      = false;
  let startLabel   = '';

  if (state.startDate) {
    const start = parseSafeDate(state.startDate);
    const today = new Date(); today.setHours(0,0,0,0);
    elapsedDays = Math.floor((today - start) / 86400000) + 1;
    isMilestone = MILESTONES.includes(elapsedDays);
    isGreen     = MILESTONES_GREEN.includes(elapsedDays);

    const s = start;
    const [y, m, d] = [s.getFullYear(), s.getMonth()+1, s.getDate()];
    startLabel = `${y}年${m}月${d}日 Started（${elapsedDays}日目）`;
  }

  // 演出：phone-frameにクラス付与
  const frame = document.querySelector('.phone-frame');
  frame.classList.remove('milestone-gold', 'milestone-green');

  if (isMilestone) {
    frame.classList.add('milestone-gold');
    const msKey = 'milestone_shown_' + elapsedDays;
    const msVal = localStorage.getItem(msKey);
    if (msVal !== getTodayStr()) {
      localStorage.setItem(msKey, getTodayStr());
      showMilestoneToast(elapsedDays, 'gold');
    }
  } else if (isGreen) {
    frame.classList.add('milestone-green');
    const msKey = 'milestone_shown_' + elapsedDays;
    const msVal = localStorage.getItem(msKey);
    if (msVal !== getTodayStr()) {
      localStorage.setItem(msKey, getTodayStr());
      showMilestoneToast(elapsedDays, 'green');
    }
  }

  let html = `
    <div class="home-title">Learning English 2</div>
    <div class="home-sub">単語と会話表現を学ぼう</div>
    <div class="mode-row">
      <div class="mode-card" onclick="showLevelSelect()">
        <div class="mode-icon" style="background:var(--info-bg)">
          <i class="ti ti-book" style="color:var(--info-text);font-size:22px"></i>
        </div>
        <div class="mode-card-name">学習モード</div>
        <div class="mode-card-desc">レベル別セット形式で着実に覚える</div>
      </div>
      <div class="mode-card" onclick="showConvoSelect()">
        <div class="mode-icon" style="background:#FFF5E6">
          <i class="ti ti-message-bolt" style="color:#FF9500;font-size:22px"></i>
        </div>
        <div class="mode-card-name">英会話</div>
        <div class="mode-card-desc">ワーホリ・留学で使える瞬間英作文</div>
      </div>
    </div>
    <div class="mode-row" style="margin-top:-6px">
      <div class="mode-card" onclick="showVocabHome()">
        <div class="mode-icon" style="background:#E8F5E9">
          <i class="ti ti-cards" style="color:#2E7D32;font-size:22px"></i>
        </div>
        <div class="mode-card-name">単語帳</div>
        <div class="mode-card-desc">自分だけの単語帳を作って練習</div>
      </div>
      <div class="mode-card" onclick="showFavorites()">
        <div class="mode-icon" style="background:#FFF0F0">
          <i class="ti ti-heart" style="color:#FF3B30;font-size:22px"></i>
        </div>
        <div class="mode-card-name">お気に入り</div>
        <div class="mode-card-desc">保存したフレーズを確認・復習</div>
      </div>
    </div>
    <div class="mode-row" style="margin-top:-6px">
      <div class="mode-card quest-home-card" onclick="showQuestHome()">
        <div class="mode-icon" style="background:linear-gradient(135deg,#1a1a2e,#16213e)">
          <i class="ti ti-bolt" style="color:#FFD700;font-size:22px"></i>
        </div>
        <div class="mode-card-name">English Quest</div>
        <div class="mode-card-desc">タイムアタック！Normal・Special・Master ⚡</div>
        <span class="quest-home-badge">Featured</span>
      </div>
      <div class="mode-card" onclick="showGlobalRanking()">
        <div class="mode-icon" style="background:#F5EEFF">
          <i class="ti ti-trophy" style="color:#AF52DE;font-size:22px"></i>
        </div>
        <div class="mode-card-name">ランキング</div>
        <div class="mode-card-desc">全ユーザーとスコアを競おう！</div>
      </div>
    </div>
    <div class="mode-row" style="margin-top:-6px">
      <div class="mode-card" onclick="showFriendsScreen()">
        <div class="mode-icon" style="background:#E8F5FF">
          <i class="ti ti-users" style="color:#007AFF;font-size:22px"></i>
        </div>
        <div class="mode-card-name">フレンド <span id="friendBadge" style="display:none;background:#FF3B30;color:#fff;border-radius:8px;font-size:10px;padding:1px 6px;margin-left:4px;vertical-align:middle"></span></div>
        <div class="mode-card-desc">フレンドの学習状況を確認しよう</div>
      </div>
      <div class="mode-card" onclick="showStats()">
        <div class="mode-icon" style="background:#E8F5FF">
          <i class="ti ti-chart-line" style="color:#007AFF;font-size:22px"></i>
        </div>
        <div class="mode-card-name">統計</div>
        <div class="mode-card-desc">学習履歴・グラフを確認する</div>
      </div>
    </div>
    `;
  document.getElementById('screenHome').innerHTML = html;
}

/* =============================================
   マイルストーントースト
   ============================================= */
function showMilestoneToast(days, color = 'gold') {
  const old = document.getElementById('milestoneToast');
  if (old) old.remove();

  const msgs = {
    2:    { emoji:'🌱', msg:'2日連続！小さな一歩が大きな差になる！' },
    3:    { emoji:'🌿', msg:'3日連続！習慣の芽が出てきたよ！' },
    10:   { emoji:'🎉', msg:'10日間続けた！最高のスタートだ！' },
    30:   { emoji:'🔥', msg:'1ヶ月達成！習慣になってきたね！' },
    50:   { emoji:'⭐', msg:'50日！本物の継続力だ！' },
    100:  { emoji:'🏆', msg:'100日達成！もう英語は生活の一部！' },
    200:  { emoji:'💎', msg:'200日！この努力は必ず実を結ぶ！' },
    300:  { emoji:'🚀', msg:'300日！あなたはレベルが違う！' },
    400:  { emoji:'👑', msg:'400日！伝説への道を歩んでる！' },
    500:  { emoji:'🌟', msg:'500日！英語脳が完成に近づいてる！' },
  };
  const def = { emoji:'🥇', msg:`${days}日達成！この継続力は本物だ！` };
  const { emoji, msg } = msgs[days] || def;

  const el = document.createElement('div');
  el.id = 'milestoneToast';
  el.className = `milestone-toast milestone-toast-${color}`;
  el.innerHTML = `
    <div class="milestone-toast-inner">
      <div class="milestone-toast-emoji">${emoji}</div>
      <div class="milestone-toast-body">
        <div class="milestone-toast-days">${days}日目 🎊</div>
        <div class="milestone-toast-msg">${msg}</div>
      </div>
    </div>
    <div class="milestone-toast-bar"></div>`;
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('milestone-toast-in'));
  });
  setTimeout(() => {
    el.classList.add('milestone-toast-out');
    setTimeout(() => el.remove(), 500);
  }, 5000);
  el.addEventListener('click', () => {
    el.classList.add('milestone-toast-out');
    setTimeout(() => el.remove(), 500);
  });
}

function showLevelSelect() {
  showScreen('screenSets');
  const el = document.getElementById('screenSets');

  // TOEIC系とそれ以外に分ける
  const normalLevels = LEVELS.filter(lv => !lv.isToeic);
  const toeicLevels  = LEVELS.filter(lv => lv.isToeic);

  let html = `
    <button class="back-btn" onclick="showHome()">
      <i class="ti ti-arrow-left"></i> ホームに戻る
    </button>
    <div class="vocab-title" style="margin-bottom:4px">学習モード</div>
    <div class="vocab-deck-count" style="margin-bottom:16px">レベルを選んでスタート</div>
    <div class="level-select">`;

  normalLevels.forEach(lv => {
    let unlocked = isLevelUnlocked(lv);
    let cleared  = isLevelCleared(lv);
    let prog     = levelProgress(lv);
    let ic       = getLevelIcon(lv.id);
    let badge    = cleared
      ? `<span class="lv-badge badge-cleared"><i class="ti ti-check" style="font-size:11px;vertical-align:-1px"></i> 完了</span>`
      : unlocked
        ? `<span class="lv-badge badge-open">挑戦可能</span>`
        : `<span class="lv-badge badge-locked"><i class="ti ti-lock" style="font-size:11px;vertical-align:-1px"></i> ロック中</span>`;
    let cardClass = 'lv-card'+(cleared?' cleared':'')+(!unlocked?' locked':'');
    let onclick   = unlocked ? `onclick="showSets('${lv.id}')"` : '';
    let progTxt   = unlocked ? `<div class="lv-prog">${prog} / ${lv.sets.length} セットクリア</div>` : '';
    html += `
      <div class="${cardClass}" ${onclick}>
        <div class="lv-icon" style="background:${ic.bg}">
          <i class="ti ${ic.icon}" style="color:${ic.color}"></i>
        </div>
        <div class="lv-info">
          <div class="lv-name">${lv.name}</div>
          <div class="lv-desc">${lv.desc}</div>
          ${progTxt}
        </div>
        ${badge}
      </div>`;
  });

  // TOEICグループカード
  if (toeicLevels.length > 0) {
    html += `
      <div class="lv-card toeic-group-card" onclick="showToeicSelect()">
        <div class="lv-icon" style="background:#FFF5E6">
          <i class="ti ti-certificate" style="color:#FF9500;font-size:20px"></i>
        </div>
        <div class="lv-info">
          <div class="lv-name">TOEIC対策</div>
          <div class="lv-desc">スコア別に単語を学習</div>
          <div class="lv-prog">600点 / 700点</div>
        </div>
        <span class="lv-badge badge-open">挑戦可能</span>
      </div>`;
  }

  html += `</div><p class="home-note">全セット全問正解で次のレベルへ</p>`;
  el.innerHTML = html;
}

/* TOEIC スコア選択画面 */
function showToeicSelect() {
  showScreen('screenSets');
  const el = document.getElementById('screenSets');

  const toeicLevels = LEVELS.filter(lv => lv.isToeic);

  let html = `
    <button class="back-btn" onclick="showLevelSelect()">
      <i class="ti ti-arrow-left"></i> レベル選択に戻る
    </button>
    <div class="vocab-title" style="margin-bottom:4px">TOEIC対策</div>
    <div class="vocab-deck-count" style="margin-bottom:16px">スコア目標を選んでスタート</div>
    <div class="level-select">`;

  toeicLevels.forEach(lv => {
    const prog    = levelProgress(lv);
    const cleared = isLevelCleared(lv);

    if (lv.comingSoon) {
      html += `
        <div class="lv-card toeic-score-card locked">
          <div class="lv-icon" style="background:#F2F2F7">
            <span style="font-size:20px;font-weight:800;color:#C7C7CC">${lv.toeicScore}</span>
          </div>
          <div class="lv-info">
            <div class="lv-name">${lv.name}</div>
            <div class="lv-desc">${lv.desc}</div>
          </div>
          <span class="lv-badge badge-locked"><i class="ti ti-lock" style="font-size:11px;vertical-align:-1px"></i> 準備中</span>
        </div>`;
    } else {
      const badge = cleared
        ? `<span class="lv-badge badge-cleared"><i class="ti ti-check" style="font-size:11px;vertical-align:-1px"></i> 完了</span>`
        : `<span class="lv-badge badge-open">挑戦可能</span>`;
      html += `
        <div class="lv-card toeic-score-card" onclick="showSets('${lv.id}')">
          <div class="lv-icon" style="background:#FFF5E6">
            <span style="font-size:20px;font-weight:800;color:#FF9500">${lv.toeicScore}</span>
          </div>
          <div class="lv-info">
            <div class="lv-name">${lv.name}</div>
            <div class="lv-desc">${lv.desc}</div>
            <div class="lv-prog">${prog} / ${lv.sets.length} セットクリア</div>
          </div>
          ${badge}
        </div>`;
    }
  });

  html += `</div>`;
  el.innerHTML = html;
}

/* =============================================
   セット選択画面
   ============================================= */
function showSets(lvId) {
  currentLevel = LEVELS.find(l => l.id === lvId);
  showScreen('screenSets');
  let prog  = levelProgress(currentLevel);
  let total = currentLevel.sets.length;
  let pct   = Math.round(prog / total * 100);
  const backFn = currentLevel.isToeic ? 'showToeicSelect()' : 'showLevelSelect()';
  const backLabel = currentLevel.isToeic ? 'TOEIC選択' : 'レベル一覧';

  let html = `
    <button class="back-btn" onclick="${backFn}">
      <i class="ti ti-arrow-left"></i> ${backLabel}
    </button>
    <div class="set-lv-name">${currentLevel.name}</div>
    <div class="set-lv-sub">${currentLevel.desc}</div>
    <div class="set-overall-bar">
      <div class="set-overall-label"><span>全体の進捗</span><span>${prog} / ${total} セット</span></div>
      <div class="prog-track"><div class="prog-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="sets-grid">`;

  currentLevel.sets.forEach((_, i) => {
    let cleared  = isSetCleared(currentLevel.id, i);
    let unlocked = isSetUnlocked(currentLevel.id, i);
    let meta     = getSetMeta(i, currentLevel);
    let cardClass = 'set-card'+(cleared?' set-cleared':'')+(!unlocked?' set-locked':'');
    let onclick   = unlocked ? `onclick="startSet('${currentLevel.id}',${i})"` : '';
    let iconCls   = cleared ? 'ti-circle-check' : unlocked ? 'ti-chevron-right' : 'ti-lock';

    if (currentLevel.isToeic) {
      // TOEICカード：カテゴリアイコン＋色付きデザイン
      const numBg    = cleared ? '' : `background:${meta.color};`;
      const iconMeta = meta.icon || 'ti-certificate';
      html += `
        <div class="${cardClass} set-card-toeic" ${onclick} style="${cleared ? '' : `--toeic-color:${meta.color};--toeic-bg:${meta.bg};`}">
          <div class="set-num-toeic" style="${cleared ? 'background:#34C75920;color:#34C759;' : `background:${meta.bg};color:${meta.color};border:1.5px solid ${meta.color}30;`}">
            ${cleared ? '<i class="ti ti-circle-check" style="font-size:18px"></i>' : `<i class="ti ${iconMeta}" style="font-size:16px"></i>`}
          </div>
          <div class="lv-info" style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
              <span class="set-title" style="font-size:14px;font-weight:700">${i+1}. ${meta.label}</span>
              ${!cleared ? `<span class="set-label-tag" style="background:${meta.bg};color:${meta.color};border-color:${meta.color}40;font-size:10px;padding:1px 7px;border-radius:6px;border:1px solid">${unlocked ? '挑戦可能' : 'ロック'}</span>` : `<span class="set-label-tag" style="background:#34C75918;color:#34C759;border-color:#34C75940;font-size:10px;padding:1px 7px;border-radius:6px;border:1px solid">完了</span>`}
            </div>
            <div class="set-sub" style="font-size:12px;color:var(--text-secondary)">${esc(meta.desc)}</div>
          </div>
          <i class="ti ${iconCls} set-icon" style="${cleared ? 'color:#34C759' : unlocked ? `color:${meta.color}` : 'color:var(--text-tertiary)'}"></i>
        </div>`;
    } else {
      let numStyle  = cleared ? '' : `background:${meta.bg};border-color:${meta.color}33;color:${meta.color}`;
      let labelHtml = meta.label && !cleared
        ? `<span class="set-label-tag" style="background:${meta.bg};color:${meta.color};border-color:${meta.color}40">${meta.label}</span>`
        : '';
      html += `
        <div class="${cardClass}" ${onclick}>
          <div class="set-num" style="${numStyle}">${i+1}</div>
          <div class="set-info">
            <div class="set-title-row">
              <span class="set-title">Set ${i+1}</span>
              ${labelHtml}
            </div>
            <div class="set-sub">${esc(meta.desc)}</div>
          </div>
          <i class="ti ${iconCls} set-icon"></i>
        </div>`;
    }
  });
  html += '</div>';
  document.getElementById('screenSets').innerHTML = html;
}

/* =============================================
   セット開始（学習モード）
   ============================================= */
function startSet(lvId, si) {
  currentLevel  = LEVELS.find(l => l.id === lvId);
  currentSetIdx = si;
  pool       = [...currentLevel.sets[si]];
  qIdx       = 0; score = 0; answered = false;
  dotResults = new Array(SET_SIZE).fill(null);
  study_mistakes = [];
  showScreen('screenQuiz');
  // TOEICはフラッシュカード形式
  if (currentLevel.isToeic) {
    tfc_idx = 0;
    tfc_flipped = false;
    tfc_results = new Array(pool.length).fill(null); // true=覚えた / false=もう一度
    renderFlashcard();
  } else {
    renderQuestion();
  }
}

/* =============================================
   フラッシュカードモード（TOEIC専用）
   ============================================= */
function renderFlashcard() {
  tfc_flipped = false;
  const q     = pool[tfc_idx];
  const total = pool.length;
  const pct   = Math.round(tfc_idx / total * 100);

  // 単語（word型）と穴埋め（fill型）で表示を変える
  const frontText = q.jp;
  const backWord  = q.type === 'word'  ? q.en : q.answer;
  const backHint  = q.type === 'fill'  ? `<div class="fc-template">${esc(q.template.replace('___', '<span class="fc-blank">'+q.answer+'</span>'))}</div>` : '';

  // 既に結果あり？
  const prevResult = tfc_results[tfc_idx];

  document.getElementById('screenQuiz').innerHTML = `
    <button class="back-btn" onclick="showSets('${currentLevel.id}')">
      <i class="ti ti-arrow-left"></i> セット選択
    </button>

    <div class="fc-header">
      <div class="fc-lv-label">${currentLevel.name} — Set ${currentSetIdx + 1}</div>
      <div class="fc-counter">${tfc_idx + 1} / ${total}</div>
    </div>

    <div class="fc-progress-wrap">
      <div class="fc-progress-track">
        <div class="fc-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="fc-stage">
      <div class="fc-card${tfc_flipped ? ' flipped' : ''}" id="fcCard" onclick="flipCard()">
        <div class="fc-face fc-front">
          <div class="fc-hint-label">日本語</div>
          <div class="fc-front-text">${esc(frontText)}</div>
          <div class="fc-tap-hint"><i class="ti ti-hand-click"></i> タップして答えを見る</div>
        </div>
        <div class="fc-face fc-back">
          <div class="fc-hint-label">英語</div>
          <div class="fc-back-word">${esc(backWord)}</div>
          ${backHint}
          <button class="fc-speak-btn" onclick="event.stopPropagation();speakEnglish('${backWord.replace(/'/g,"\\'")}')">
            <i class="ti ti-volume"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="fc-nav" id="fcNav" style="display:none">
      <button class="fc-btn fc-btn-again" onclick="fcAnswer(false)">
        <i class="ti ti-refresh"></i> もう一度
      </button>
      <button class="fc-btn fc-btn-got" onclick="fcAnswer(true)">
        <i class="ti ti-check"></i> 覚えた！
      </button>
    </div>

    <div class="fc-dots">
      ${pool.map((_, i) => {
        let cls = 'fc-dot';
        if (tfc_results[i] === true)  cls += ' fc-dot-got';
        if (tfc_results[i] === false) cls += ' fc-dot-again';
        if (i === tfc_idx && tfc_results[i] === null) cls += ' fc-dot-cur';
        return `<div class="${cls}"></div>`;
      }).join('')}
    </div>
  `;
}

function flipCard() {
  if (tfc_flipped) return;
  tfc_flipped = true;
  const card = document.getElementById('fcCard');
  if (card) card.classList.add('flipped');
  const nav = document.getElementById('fcNav');
  if (nav) nav.style.display = 'flex';
}

function fcAnswer(got) {
  tfc_results[tfc_idx] = got;
  if (got) {
    score++;
    grantXp(10);
    state.todayStudied = true;
    if (state.lastDate !== getTodayStr()) state.streak++;
    updateTopBar();
    saveState();
    updateReminder();
    maybeShowStreakToast();
  } else {
    const q = pool[tfc_idx];
    const ans = q.type === 'word' ? q.en : q.answer;
    study_mistakes.push({ jp: q.jp, en: ans, userAnswer: '' });
  }
  tfc_idx++;
  if (tfc_idx >= pool.length) {
    showFlashcardResult();
  } else {
    renderFlashcard();
  }
}

function showFlashcardResult() {
  const total   = pool.length;
  const got     = tfc_results.filter(r => r === true).length;
  const pct     = Math.round(got / total * 100);
  const perfect = got === total;
  const wasCleared = isSetCleared(currentLevel.id, currentSetIdx);

  if (perfect && !wasCleared) {
    if (!state.clearedSets[currentLevel.id]) state.clearedSets[currentLevel.id] = [];
    state.clearedSets[currentLevel.id].push(currentSetIdx);
    saveState();
  }

  const msg = perfect ? 'パーフェクト！全問正解 🎉'
    : pct >= 70 ? 'いい調子！もう一度やれば完璧に 💪'
    : '繰り返して定着させよう 📖';

  const unlockHtml = perfect && !wasCleared
    ? `<div class="unlock-banner"><i class="ti ti-lock-open"></i><span>このセットをクリアしました！</span></div>`
    : '';

  showScreen('screenResult');
  document.getElementById('screenResult').innerHTML = `
    <div class="result-wrap">
      <div class="result-lv-label">${currentLevel.name} — Set ${currentSetIdx + 1}</div>
      <div class="result-score">${got} / ${total}</div>
      <div class="result-total">${pct}% 覚えた</div>
      <div class="result-msg">${msg}</div>
      ${unlockHtml}
      ${buildMistakesHTML(study_mistakes)}
      <div class="action-btns">
        <button onclick="startSet('${currentLevel.id}',${currentSetIdx})">${perfect ? 'もう一度やる' : '再挑戦する'}</button>
        <button class="primary" onclick="showSets('${currentLevel.id}')">セット一覧へ</button>
      </div>
    </div>`;
}

/* =============================================
   問題描画（学習モード）
   ============================================= */
function renderQuestion() {
  answered = false;
  let q    = pool[qIdx];
  let pct  = Math.round(qIdx / SET_SIZE * 100);
  let gNum = currentSetIdx * SET_SIZE + qIdx + 1;

  let dotsHtml = pool.map((_,i) => {
    let cls = 'dot';
    if (dotResults[i]===true)  cls += ' ok';
    if (dotResults[i]===false) cls += ' ng';
    if (i===qIdx && dotResults[i]===null) cls += ' cur';
    return `<div class="${cls}" id="dot${i}"></div>`;
  }).join('');

  window._currentOpts = q.opts ? shuffle(q.opts) : [];
  let inputHtml = q.type==='word'
    ? `<div class="options">${window._currentOpts.map((o,i)=>`<button class="opt" data-idx="${i}" onclick="checkWordByIdx(${i})">${esc(o)}</button>`).join('')}</div>`
    : `<div class="fill-wrap"><input class="fill-in" id="fillIn" placeholder="英語を入力..." autocomplete="off" autocapitalize="off" spellcheck="false"></div>
       <button class="check-btn" onclick="checkFill()">確認する</button>`;

  document.getElementById('screenQuiz').innerHTML = `
    <button class="back-btn" onclick="showSets('${currentLevel.id}')">
      <i class="ti ti-arrow-left"></i> セット選択に戻る
    </button>
    <div class="lv-label">${currentLevel.name} — Set ${currentSetIdx+1}（問題 ${gNum}）</div>
    <div class="progress-row">
      <div class="prog-track"><div class="prog-fill" style="width:${pct}%"></div></div>
      <span class="prog-text">${qIdx+1} / ${SET_SIZE}</span>
    </div>
    <div class="dots">${dotsHtml}</div>
    <div class="q-card">
      <div class="q-type">${q.type==='word'?'単語クイズ':'フレーズ穴埋め'}</div>
      <div class="q-main">${esc(q.jp)}</div>
      <div class="q-sub">${q.type==='word'?'英語で何と言う？':esc(q.template.replace('___','(     )'))}</div>
    </div>
    ${inputHtml}
    <div class="feedback" id="feedback"></div>
    <button class="next-btn" id="nextBtn" onclick="nextQ()">
      ${qIdx+1 < SET_SIZE ? '次の問題 →' : '結果を見る →'}
    </button>`;

  if (q.type==='fill') {
    let fi = document.getElementById('fillIn');
    if (fi) fi.addEventListener('keydown', e => { if (e.key==='Enter') checkFill(); });
  }
}

/* =============================================
   回答チェック（学習モード）
   ============================================= */
function checkWordByIdx(chosenIdx) {
  if (answered) return;
  const opts    = window._currentOpts || [];
  const chosen  = opts[chosenIdx];
  const correct = pool[qIdx].en;
  answered = true;
  let ok = chosen === correct;
  document.querySelectorAll('.opt').forEach(b => {
    b.disabled = true;
    const bVal = opts[parseInt(b.dataset.idx)];
    if (bVal === correct) b.className = 'opt correct';
    else if (bVal === chosen && !ok) b.className = 'opt wrong';
  });
  doStudyFeedback(ok, correct);
}
function checkWord(chosen, correct) { checkWordByIdx((window._currentOpts||[]).indexOf(chosen)); }

function checkFill() {
  if (answered) return;
  let q   = pool[qIdx];
  let val = (document.getElementById('fillIn').value||'').trim().toLowerCase();
  let ok  = val === q.answer.toLowerCase() || normalizeAns(val) === normalizeAns(q.answer);
  let fi  = document.getElementById('fillIn');
  if (fi) fi.disabled=true;
  let cb  = document.querySelector('.check-btn');
  if (cb) cb.disabled=true;
  doStudyFeedback(ok, q.answer);
}

function doStudyFeedback(ok, correct) {
  answered=true; dotResults[qIdx]=ok;
  let dot = document.getElementById('dot'+qIdx);
  if (dot) dot.className='dot '+(ok?'ok':'ng');
  if (ok) {
    score++; grantXp(10); state.todayStudied=true;
    if (state.lastDate!==getTodayStr()) state.streak++;
    updateTopBar(); saveState();
    updateReminder();
    maybeShowStreakToast();
  } else {
    const q = pool[qIdx];
    const userVal = (document.getElementById('fillIn')?.value || document.querySelector('.opt.wrong')?.textContent || '').trim();
    study_mistakes.push({ jp: q.jp, en: correct, userAnswer: userVal });
  }
  let fb = document.getElementById('feedback');
  fb.className  = 'feedback '+(ok?'ok':'ng');
  fb.textContent = ok ? '正解！ +10 XP' : '不正解。正解は「'+correct+'」';
  document.getElementById('nextBtn').style.display='block';
}

function nextQ() {
  qIdx++;
  if (qIdx>=SET_SIZE) showStudyResult();
  else renderQuestion();
}

/* =============================================
   学習モード結果
   ============================================= */
function showStudyResult() {
  let perfect    = score===SET_SIZE;
  let wasCleared = isSetCleared(currentLevel.id, currentSetIdx);
  let unlockedSet=null, unlockedLevel=null;

  if (perfect && !wasCleared) {
    if (!state.clearedSets[currentLevel.id]) state.clearedSets[currentLevel.id]=[];
    state.clearedSets[currentLevel.id].push(currentSetIdx);
    saveState();
    let ns = currentSetIdx+1;
    if (ns < currentLevel.sets.length) unlockedSet = ns+1;
    if (isLevelCleared(currentLevel)) {
      let ni = LEVELS.findIndex(l=>l.id===currentLevel.id)+1;
      if (ni<LEVELS.length) unlockedLevel=LEVELS[ni];
    }
  }

  showScreen('screenResult');
  let pct = Math.round(score/SET_SIZE*100);
  let msg = perfect ? 'パーフェクト！全問正解です 🎉'
    : pct>=70 ? 'よくできました！全問正解まであと少し'
    : '復習してもう一度挑戦しよう 💪';

  let unlockHtml = unlockedLevel
    ? `<div class="unlock-banner"><i class="ti ti-lock-open"></i><span><strong>${unlockedLevel.name}</strong> のロックが解除されました！</span></div>`
    : unlockedSet
      ? `<div class="unlock-banner"><i class="ti ti-lock-open"></i><span>Set ${unlockedSet} のロックが解除されました！</span></div>`
      : '';

  document.getElementById('screenResult').innerHTML = `
    <div class="result-wrap">
      <div class="result-lv-label">${currentLevel.name} — Set ${currentSetIdx+1}</div>
      <div class="result-score">${score} / ${SET_SIZE}</div>
      <div class="result-total">${pct}% 正解</div>
      <div class="result-msg">${msg}</div>
      ${unlockHtml}
      <div class="action-btns">
        <button onclick="startSet('${currentLevel.id}',${currentSetIdx})">${perfect?'もう一度やる':'再挑戦する'}</button>
        <button class="primary" onclick="showSets('${currentLevel.id}')">セット一覧へ</button>
      </div>
      ${buildMistakesHTML(study_mistakes)}
    </div>`;
}

/* =============================================
   対戦モード — セットアップ画面
   ============================================= */
function showConvoSelect() {
  showScreen('screenConvo');
  let total = CONVO_LEVELS.reduce((s, lv) => s + lv.phrases.length, 0);
  let html = `
    <div class="back-btn-row">
      <button class="back-btn" onclick="showHome()">
        <i class="ti ti-arrow-left"></i> ホームに戻る
      </button>
    </div>
    <div class="convo-header">
      <div class="convo-title">最短英会話モード</div>
      <div class="convo-sub">ワーホリ・留学でよく使う ${total} フレーズ</div>
    </div>
    <div class="convo-levels">`;

  CONVO_LEVELS.forEach(lv => {
    html += `
      <div class="convo-lv-card" onclick="startConvo('${lv.id}')">
        <div class="convo-lv-icon" style="background:${lv.bg}">
          <i class="ti ${lv.icon}" style="color:${lv.color};font-size:20px"></i>
        </div>
        <div class="convo-lv-info">
          <div class="convo-lv-top">
            <span class="convo-lv-name">Level ${lv.level}</span>
            <span class="convo-lv-tag" style="background:${lv.bg};color:${lv.color};border-color:${lv.color}40">${lv.label}</span>
          </div>
          <div class="convo-lv-desc">${lv.desc}</div>
          <div class="convo-lv-count">${lv.phrases.length} フレーズ</div>
        </div>
        <i class="ti ti-chevron-right" style="color:var(--text-tertiary);font-size:16px;flex-shrink:0"></i>
      </div>`;
  });

  html += `</div>`;
  document.getElementById('screenConvo').innerHTML = html;
}

// セッション開始
function startConvo(lvId) {
  cv_level    = CONVO_LEVELS.find(l => l.id === lvId);
  cv_pool     = shuffle([...cv_level.phrases]);
  cv_idx      = 0;
  cv_score    = 0;
  cv_answered = false;
  cv_mistakes = [];
  renderConvoQ();
}

// 問題描画
function renderConvoQ() {
  cv_answered = false;
  let q    = cv_pool[cv_idx];
  let prog = Math.round(cv_idx / cv_pool.length * 100);
  let lv   = cv_level;

  document.getElementById('screenConvo').innerHTML = `
    <button class="back-btn" onclick="showConvoSelect()">
      <i class="ti ti-arrow-left"></i> レベル選択に戻る
    </button>
    <div class="convo-session-meta">
      <span class="convo-lv-tag" style="background:${lv.bg};color:${lv.color};border-color:${lv.color}40">
        Level ${lv.level} — ${lv.label}
      </span>
      <span class="convo-prog-txt">${cv_idx + 1} / ${cv_pool.length}</span>
    </div>
    <div class="progress-row" style="margin-bottom:16px">
      <div class="prog-track" style="flex:1"><div class="prog-fill" style="width:${prog}%;background:${lv.color}"></div></div>
    </div>
    <div class="convo-q-card">
      <div class="convo-q-label">日本語 → 英語にしてみよう</div>
      <div class="convo-q-jp">${esc(q.jp)}</div>
    </div>
    <div class="fill-wrap">
      <input class="fill-in" id="convoInput"
        placeholder="英語を入力..."
        autocomplete="off" autocapitalize="off" spellcheck="false">
    </div>
    <button class="check-btn" id="convoCheckBtn" onclick="checkConvo()">確認する</button>
    <div class="feedback" id="convoFeedback"></div>
    <button class="fav-btn" id="convoFavBtn" onclick="toggleConvoFav()" style="margin:8px auto;display:flex;">
      ${isFavorite(q.jp, q.answers[0]) ? '<i class="ti ti-heart-filled"></i> お気に入り済み' : '<i class="ti ti-heart"></i> お気に入りに追加'}
    </button>
    <button class="next-btn" id="convoNextBtn" onclick="nextConvo()">
      ${cv_idx + 1 < cv_pool.length ? '次のフレーズ →' : '結果を見る →'}
    </button>`;

  let inp = document.getElementById('convoInput');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkConvo(); });
}

// 正誤チェック
function checkConvo() {
  if (cv_answered) return;
  cv_answered = true;

  let q        = cv_pool[cv_idx];
  let raw      = (document.getElementById('convoInput').value || '').trim();
  let input    = raw.toLowerCase();

  let exactMatch    = q.answers.some(a => a.toLowerCase() === input);
  let normalMatch   = !exactMatch && q.answers.some(a => normalizeAns(a) === normalizeAns(input));
  let ok            = exactMatch || normalMatch;

  let inp = document.getElementById('convoInput');
  if (inp) inp.disabled = true;
  let btn = document.getElementById('convoCheckBtn');
  if (btn) btn.disabled = true;

  let fb = document.getElementById('convoFeedback');
  if (ok) {
    cv_score++;
    grantXp(5); state.todayStudied = true;
    if (state.lastDate !== getTodayStr()) state.streak++;
    updateTopBar(); saveState();
    updateReminder();
    maybeShowStreakToast();

    if (normalMatch) {
      // 正解だが句読点忘れ
      let correct = q.answers[0];
      let punct   = correct.match(/[.?!]+$/)?.[0] || '';
      fb.className = 'feedback convo-warn';
      fb.innerHTML = `<i class="ti ti-check" style="color:var(--success-text)"></i> 正解！ +5 XP　<span class="punct-note">末尾に「${esc(punct)}」を忘れずに！</span>`;
    } else {
      fb.className = 'feedback ok';
      fb.textContent = '正解！ +5 XP';
    }
  } else {
    let correctList = q.answers.map(a => `「${esc(a)}」`).join(' または ');
    fb.className = 'feedback ng';
    fb.innerHTML = `不正解。正解は ${correctList}`;
    cv_mistakes.push({ jp: q.jp, en: q.answers[0], userAnswer: raw });
  }
  fb.style.display = 'block';
  document.getElementById('convoNextBtn').style.display = 'block';
}

function toggleConvoFav() {
  const q = cv_pool[cv_idx];
  const added = toggleFavorite(q.jp, q.answers[0]);
  const btn = document.getElementById('convoFavBtn');
  if (btn) {
    btn.innerHTML = added
      ? '<i class="ti ti-heart-filled"></i> お気に入り済み'
      : '<i class="ti ti-heart"></i> お気に入りに追加';
    btn.classList.toggle('faved', added);
  }
}

// 次の問題へ
function nextConvo() {
  cv_idx++;
  if (cv_idx >= cv_pool.length) showConvoResult();
  else renderConvoQ();
}

// 結果画面
function showConvoResult() {
  let lv      = cv_level;
  let total   = cv_pool.length;
  let pct     = Math.round(cv_score / total * 100);
  let emoji   = pct === 100 ? '🎉' : pct >= 70 ? '👍' : pct >= 40 ? '💪' : '📖';
  let msg     = pct === 100 ? '全問正解！完璧です！'
              : pct >= 70  ? 'よく出来ました！惜しいものを復習しよう'
              : pct >= 40  ? 'まだ伸びしろあり。もう一度挑戦！'
              : 'フレーズをもう少し覚えてから再挑戦！';

  document.getElementById('screenConvo').innerHTML = `
    <div class="result-wrap" style="margin-top:20px">
      <div class="result-lv-label">Level ${lv.level} — ${lv.label}</div>
      <div style="font-size:44px;margin:10px 0 2px">${emoji}</div>
      <div class="result-score">${cv_score}<span style="font-size:22px;font-weight:400;color:var(--text-secondary)"> / ${total}</span></div>
      <div class="result-total">${pct}% 正解</div>
      <div class="result-msg">${msg}</div>
      <div class="action-btns">
        <button onclick="startConvo('${lv.id}')">もう一度</button>
        <button class="primary" onclick="showConvoSelect()">レベル選択へ</button>
      </div>
      ${buildMistakesHTML(cv_mistakes)}
    </div>`;
}

/* =============================================
   フレンドランキング画面
   ============================================= */
/* =============================================
   単語帳機能
   ============================================= */
const VOCAB_KEY = 'eq_vocab_v1';

// デッキ一覧をlocalStorageから読む
function loadDecks() {
  try { return JSON.parse(localStorage.getItem(VOCAB_KEY) || '[]'); } catch(e) { return []; }
}
function saveDecks(decks) {
  localStorage.setItem(VOCAB_KEY, JSON.stringify(decks));
}
function genDeckId() {
  return 'd_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

/* ---------- 単語帳ホーム ---------- */
function showVocabHome() {
  showScreen('screenVocab');
  renderVocabHome();
}

function renderVocabHome() {
  const decks = loadDecks();
  const el = document.getElementById('screenVocab');

  const deckCards = decks.length === 0
    ? `<div class="vocab-empty"><i class="ti ti-cards" style="font-size:36px;color:var(--text-tertiary);margin-bottom:10px"></i><div>まだ単語帳がありません</div><div style="font-size:12px;margin-top:4px;color:var(--text-tertiary)">「新しい単語帳を作る」から始めよう</div></div>`
    : decks.map(d => {
        const count = d.cards.length;
        return `
          <div class="vocab-deck-card" onclick="showDeckDetail('${d.id}')">
            <div class="vocab-deck-icon"><i class="ti ti-cards"></i></div>
            <div class="vocab-deck-info">
              <div class="vocab-deck-name">${esc(d.name)}</div>
              <div class="vocab-deck-meta">${count}語</div>
            </div>
            <i class="ti ti-chevron-right" style="color:var(--text-tertiary);font-size:16px;flex-shrink:0"></i>
          </div>`;
      }).join('');

  el.innerHTML = `
    <button class="back-btn" onclick="showHome()">
      <i class="ti ti-arrow-left"></i> ホームに戻る
    </button>
    <div class="vocab-header">
      <div class="vocab-title">単語帳</div>
      <button class="vocab-new-btn" onclick="showNewDeckForm()">
        <i class="ti ti-plus"></i> 新しい単語帳
      </button>
    </div>
    <div class="vocab-deck-list">${deckCards}</div>`;
}

/* ---------- 新規デッキ作成フォーム ---------- */
function showNewDeckForm() {
  const overlay = document.createElement('div');
  overlay.id = 'vocabOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title"><i class="ti ti-plus" style="color:var(--accent)"></i> 新しい単語帳</div>
      <div class="vocab-field-label">単語帳の名前</div>
      <input class="vocab-input" id="deckNameInput" placeholder="例：旅行英語・TOEIC頻出など" maxlength="30" autofocus>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="vocab-cancel-btn" onclick="closeVocabOverlay()">キャンセル</button>
        <button class="vocab-ok-btn" onclick="createDeck()">作成</button>
      </div>
    </div>`;
  overlay.addEventListener('click', closeVocabOverlay);
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('deckNameInput')?.focus(), 100);
}

function closeVocabOverlay() {
  const o = document.getElementById('vocabOverlay');
  if (o) o.remove();
}

function createDeck() {
  const name = (document.getElementById('deckNameInput')?.value || '').trim();
  if (!name) return;
  const decks = loadDecks();
  decks.push({ id: genDeckId(), name, cards: [], createdAt: Date.now() });
  saveDecks(decks);
  closeVocabOverlay();
  renderVocabHome();
}

/* ---------- デッキ詳細（単語一覧）---------- */
function showDeckDetail(deckId) {
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck) return;
  const el = document.getElementById('screenVocab');
  const count = deck.cards.length;

  const cardRows = count === 0
    ? `<div class="vocab-empty" style="margin-top:20px"><i class="ti ti-writing" style="font-size:32px;color:var(--text-tertiary);margin-bottom:8px"></i><div>単語がまだありません</div><div style="font-size:12px;margin-top:4px;color:var(--text-tertiary)">「単語を追加」から登録しよう</div></div>`
    : deck.cards.map((c, i) => `
        <div class="vocab-word-row" draggable="true" data-idx="${i}"
          ondragstart="vocabDragStart(event,${i})"
          ondragover="vocabDragOver(event)"
          ondrop="vocabDrop(event,${i},'${deckId}')"
          ondragend="vocabDragEnd(event)">
          <div class="vocab-drag-handle"><i class="ti ti-grip-vertical"></i></div>
          <div class="vocab-word-body">
            <div class="vocab-word-en">${esc(c.en)}</div>
            <div class="vocab-word-jp">${esc(c.jp)}</div>
          </div>
          <div class="vocab-word-actions">
            <button class="vocab-edit-btn" onclick="showEditCardForm('${deckId}',${i})"><i class="ti ti-pencil"></i></button>
            <button class="vocab-del-btn" onclick="deleteCard('${deckId}',${i})"><i class="ti ti-trash"></i></button>
          </div>
        </div>`).join('');

  // テストモード問題数ボタン
  const TEST_SIZES = [10, 30, 50, 100];
  const testBtns = TEST_SIZES.map(n => {
    const ok = count >= n;
    return `<button class="vocab-test-size-btn ${ok ? '' : 'vocab-test-size-disabled'}"
      onclick="${ok ? `showTestModeConfirm('${deckId}',${n})` : `showTestTooFew(${n},${count})`}">
      ${n}問${!ok ? `<span class="vocab-test-lock"><i class="ti ti-lock"></i></span>` : ''}
    </button>`;
  }).join('');

  el.innerHTML = `
    <button class="back-btn" onclick="showVocabHome()">
      <i class="ti ti-arrow-left"></i> 単語帳一覧
    </button>
    <div class="vocab-header">
      <div>
        <div class="vocab-title">${esc(deck.name)}</div>
        <div class="vocab-deck-count">${count}語</div>
      </div>
      <div style="display:flex;gap:8px">
        ${count > 0 ? `<button class="vocab-study-btn" onclick="startFlashcard('${deckId}','jp2en')"><i class="ti ti-player-play"></i> 学習</button>` : ''}
        <button class="vocab-new-btn" onclick="showAddCardForm('${deckId}')"><i class="ti ti-plus"></i> 追加</button>
      </div>
    </div>
    ${count > 0 ? `
    <div class="vocab-section-label">フラッシュカード</div>
    <div class="vocab-dir-row">
      <button class="vocab-dir-btn vocab-dir-active" onclick="startFlashcard('${deckId}','jp2en')">🇯🇵→🇬🇧 日→英</button>
      <button class="vocab-dir-btn" onclick="startFlashcard('${deckId}','en2jp')">🇬🇧→🇯🇵 英→日</button>
      <button class="vocab-dir-btn" onclick="startFlashcard('${deckId}','random')">🔀 ランダム</button>
    </div>
    <div class="vocab-section-label" style="margin-top:14px">
      テストモード <span class="vocab-test-xp-note">正解1問 +1 XP・全問正解でボーナスあり</span>
    </div>
    <div class="vocab-test-size-row">${testBtns}</div>` : ''}
    <div class="vocab-section-label" style="margin-top:14px">
      単語一覧 <span class="vocab-reorder-hint"><i class="ti ti-grip-vertical"></i> ドラッグで並び替え</span>
    </div>
    <div class="vocab-word-list" id="vocabWordList">${cardRows}</div>`;
}

/* ---------- 単語追加フォーム ---------- */
function showAddCardForm(deckId) {
  const overlay = document.createElement('div');
  overlay.id = 'vocabOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title"><i class="ti ti-plus" style="color:var(--accent)"></i> 単語を追加</div>
      <div class="vocab-field-label">英語</div>
      <input class="vocab-input" id="cardEnInput" placeholder="例：apple" autocapitalize="off" spellcheck="false">
      <div class="vocab-field-label" style="margin-top:10px">日本語</div>
      <input class="vocab-input" id="cardJpInput" placeholder="例：りんご">
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="vocab-cancel-btn" onclick="closeVocabOverlay()">キャンセル</button>
        <button class="vocab-ok-btn" onclick="addCard('${deckId}')">追加</button>
      </div>
      <div class="vocab-add-hint">追加後もこの画面のままで続けて登録できます</div>
    </div>`;
  overlay.addEventListener('click', closeVocabOverlay);
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('cardEnInput')?.focus(), 100);

  // Enterで次のフィールドへ / 追加
  setTimeout(() => {
    document.getElementById('cardEnInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('cardJpInput')?.focus();
    });
    document.getElementById('cardJpInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') addCard(deckId);
    });
  }, 150);
}

function addCard(deckId) {
  const en = (document.getElementById('cardEnInput')?.value || '').trim();
  const jp = (document.getElementById('cardJpInput')?.value || '').trim();
  if (!en || !jp) return;
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck) return;
  deck.cards.push({ en, jp, known: false, addedAt: Date.now() });
  saveDecks(decks);
  // 入力をクリアして連続追加できるように
  const enInput = document.getElementById('cardEnInput');
  const jpInput = document.getElementById('cardJpInput');
  if (enInput) { enInput.value = ''; enInput.focus(); }
  if (jpInput) jpInput.value = '';
  // ヒントを一瞬「追加した！」に
  const hint = document.querySelector('.vocab-add-hint');
  if (hint) {
    hint.textContent = `「${en}」を追加しました ✓`;
    hint.style.color = 'var(--success-text)';
    setTimeout(() => { hint.textContent = '追加後もこの画面のままで続けて登録できます'; hint.style.color = ''; }, 2000);
  }
}

function deleteCard(deckId, idx) {
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck) return;
  deck.cards.splice(idx, 1);
  saveDecks(decks);
  showDeckDetail(deckId);
}

/* ---------- カード編集フォーム ---------- */
function showEditCardForm(deckId, idx) {
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck) return;
  const card = deck.cards[idx];
  const overlay = document.createElement('div');
  overlay.id = 'vocabOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title"><i class="ti ti-pencil" style="color:var(--accent)"></i> カードを編集</div>
      <div class="vocab-field-label">英語</div>
      <input class="vocab-input" id="editEnInput" value="${esc(card.en)}" autocapitalize="off" spellcheck="false">
      <div class="vocab-field-label" style="margin-top:10px">日本語</div>
      <input class="vocab-input" id="editJpInput" value="${esc(card.jp)}">
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="vocab-cancel-btn" onclick="closeVocabOverlay()">キャンセル</button>
        <button class="vocab-ok-btn" onclick="saveEditCard('${deckId}',${idx})">保存</button>
      </div>
    </div>`;
  overlay.addEventListener('click', closeVocabOverlay);
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('editEnInput')?.focus(), 100);
}

function saveEditCard(deckId, idx) {
  const en = (document.getElementById('editEnInput')?.value || '').trim();
  const jp = (document.getElementById('editJpInput')?.value || '').trim();
  if (!en || !jp) return;
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck) return;
  deck.cards[idx].en = en;
  deck.cards[idx].jp = jp;
  saveDecks(decks);
  closeVocabOverlay();
  showDeckDetail(deckId);
}

/* ---------- ドラッグ&ドロップで並び替え ---------- */
let _dragSrcIdx = null;

function vocabDragStart(e, idx) {
  _dragSrcIdx = idx;
  e.currentTarget.classList.add('vocab-dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function vocabDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.vocab-word-row').forEach(r => r.classList.remove('vocab-drag-over'));
  e.currentTarget.classList.add('vocab-drag-over');
}

function vocabDrop(e, targetIdx, deckId) {
  e.preventDefault();
  if (_dragSrcIdx === null || _dragSrcIdx === targetIdx) return;
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck) return;
  const moved = deck.cards.splice(_dragSrcIdx, 1)[0];
  deck.cards.splice(targetIdx, 0, moved);
  saveDecks(decks);
  showDeckDetail(deckId);
}

function vocabDragEnd(e) {
  _dragSrcIdx = null;
  document.querySelectorAll('.vocab-word-row').forEach(r => {
    r.classList.remove('vocab-dragging', 'vocab-drag-over');
  });
}

/* ---------- テストモード ---------- */
const TEST_BONUS = { 10: 10, 30: 50, 50: 150, 100: 500 };

let tm_deckId, tm_size, tm_pool, tm_idx, tm_correct, tm_answered;
let tm_mistakes = [];

function showTestTooFew(need, have) {
  const overlay = document.createElement('div');
  overlay.id = 'vocabOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title" style="color:var(--danger-text)">
        <i class="ti ti-lock"></i> 単語が足りません
      </div>
      <div class="vocab-test-toofew-msg">
        ${need}問テストには <strong>${need}語以上</strong> 必要です。<br>
        現在の単語数：<strong>${have}語</strong>
      </div>
      <button class="vocab-ok-btn" style="margin-top:12px" onclick="closeVocabOverlay()">閉じる</button>
    </div>`;
  overlay.addEventListener('click', closeVocabOverlay);
  document.body.appendChild(overlay);
}

function showTestModeConfirm(deckId, size) {
  const bonus = TEST_BONUS[size];
  const overlay = document.createElement('div');
  overlay.id = 'vocabOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title"><i class="ti ti-pencil" style="color:var(--accent)"></i> ${size}問テスト</div>
      <div class="vocab-test-confirm-info">
        <div class="vocab-test-confirm-row"><i class="ti ti-plus-circle" style="color:var(--success-text)"></i> 正解1問につき <strong>+1 XP</strong></div>
        <div class="vocab-test-confirm-row"><i class="ti ti-trophy" style="color:#B8860B"></i> 全問正解ボーナス <strong>+${bonus} XP</strong></div>
        <div class="vocab-test-confirm-row" style="color:var(--text-tertiary);font-size:12px"><i class="ti ti-info-circle"></i> 日本語→英語のタイピングで出題</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="vocab-cancel-btn" onclick="closeVocabOverlay()">キャンセル</button>
        <button class="vocab-ok-btn" onclick="closeVocabOverlay();startTestMode('${deckId}',${size})">
          <i class="ti ti-player-play"></i> スタート
        </button>
      </div>
    </div>`;
  overlay.addEventListener('click', closeVocabOverlay);
  document.body.appendChild(overlay);
}

function startTestMode(deckId, size) {
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck || deck.cards.length < size) return;

  tm_deckId   = deckId;
  tm_size     = size;
  tm_pool     = shuffle([...deck.cards]).slice(0, size);
  tm_idx      = 0;
  tm_correct  = 0;
  tm_answered = false;
  tm_mistakes = [];

  renderTestQuestion();
}

function renderTestQuestion() {
  const decks  = loadDecks();
  const deck   = decks.find(d => d.id === tm_deckId);
  const card   = tm_pool[tm_idx];
  const pct    = Math.round(tm_idx / tm_size * 100);

  const el = document.getElementById('screenVocab');
  el.innerHTML = `
    <button class="back-btn" onclick="confirmAbortTest('${tm_deckId}')">
      <i class="ti ti-arrow-left"></i> テスト中断
    </button>
    <div class="fc-header">
      <span class="fc-progress-text">問題 ${tm_idx + 1} / ${tm_size}</span>
      <span class="fc-stats">
        <span class="fc-stat-known"><i class="ti ti-check"></i>${tm_correct}</span>
        <span class="fc-stat-unknown"><i class="ti ti-x"></i>${tm_idx - tm_correct}</span>
      </span>
    </div>
    <div class="fc-prog-track"><div class="fc-prog-fill" style="width:${pct}%"></div></div>

    <div class="tm-card">
      <div class="tm-card-label">日本語</div>
      <div class="tm-card-jp">${esc(card.jp)}</div>
    </div>

    <div class="tm-input-label">英語で入力してください</div>
    <div class="tm-input-wrap">
      <input class="tm-input" id="tmInput"
        placeholder="英語を入力..."
        autocomplete="off" autocapitalize="off" spellcheck="false">
      <button class="tm-speak-btn" id="tmSpeakHint" style="display:none"
        data-speak="${esc(card.en)}" onclick="speakEnglish(this.dataset.speak)">
        <i class="ti ti-volume"></i>
      </button>
    </div>
    <button class="tm-check-btn" id="tmCheckBtn" onclick="checkTestAnswer()">
      確認する
    </button>
    <div class="tm-feedback" id="tmFeedback"></div>
    <button class="tm-next-btn" id="tmNextBtn" onclick="nextTestQuestion()" style="display:none">
      ${tm_idx + 1 < tm_size ? '次の問題 →' : '結果を見る →'}
    </button>`;

  const inp = document.getElementById('tmInput');
  if (inp) {
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !tm_answered) checkTestAnswer(); });
  }
}

function checkTestAnswer() {
  if (tm_answered) return;
  tm_answered = true;

  const card  = tm_pool[tm_idx];
  const input = (document.getElementById('tmInput')?.value || '').trim().toLowerCase();
  const correct = card.en.trim().toLowerCase();

  // 句読点・プレースホルダーを除いた比較
  const ok = input === correct || normalizeAns(input) === normalizeAns(correct);

  const inp = document.getElementById('tmInput');
  if (inp) inp.disabled = true;
  const checkBtn = document.getElementById('tmCheckBtn');
  if (checkBtn) checkBtn.disabled = true;

  const fb   = document.getElementById('tmFeedback');
  const next = document.getElementById('tmNextBtn');
  const speakHint = document.getElementById('tmSpeakHint');

  if (ok) {
    tm_correct++;
    fb.className = 'tm-feedback tm-feedback-ok';
    fb.innerHTML = `<i class="ti ti-circle-check"></i> 正解！ <span class="tm-xp-badge">+1 XP</span>`;
    // XPはここでは加算しない（結果画面でまとめて加算）
  } else {
    fb.className = 'tm-feedback tm-feedback-ng';
    fb.innerHTML = `<i class="ti ti-circle-x"></i> 不正解。正解は <strong>${esc(card.en)}</strong>`;
    if (speakHint) speakHint.style.display = 'flex';
    tm_mistakes.push({ jp: card.jp, en: card.en, userAnswer: (document.getElementById('tmInput')?.value || '').trim() });
  }
  fb.style.display = 'flex';
  if (next) next.style.display = 'block';

  // 正解時は自動で英語読み上げ
  if (ok) setTimeout(() => speakEnglish(card.en), 200);
}

function nextTestQuestion() {
  tm_idx++;
  tm_answered = false;
  if (tm_idx >= tm_size) {
    showTestResult();
  } else {
    renderTestQuestion();
  }
}

function confirmAbortTest(deckId) {
  const overlay = document.createElement('div');
  overlay.id = 'vocabOverlay';
  overlay.className = 'vocab-overlay';
  overlay.innerHTML = `
    <div class="vocab-sheet" onclick="event.stopPropagation()">
      <div class="vocab-sheet-handle"></div>
      <div class="vocab-sheet-title" style="color:var(--danger-text)">
        <i class="ti ti-alert-triangle"></i> テストを中断しますか？
      </div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
        進捗はリセットされます。XPは獲得できません。
      </div>
      <div style="display:flex;gap:8px">
        <button class="vocab-cancel-btn" onclick="closeVocabOverlay()">続ける</button>
        <button class="vocab-ok-btn" style="background:var(--danger-text)"
          onclick="closeVocabOverlay();showDeckDetail('${deckId}')">中断する</button>
      </div>
    </div>`;
  overlay.addEventListener('click', closeVocabOverlay);
  document.body.appendChild(overlay);
}

function showTestResult() {
  const decks    = loadDecks();
  const deck     = decks.find(d => d.id === tm_deckId);
  const pct      = Math.round(tm_correct / tm_size * 100);
  const perfect  = tm_correct === tm_size;
  const bonus    = perfect ? TEST_BONUS[tm_size] : 0;
  const xpEarned = tm_correct + bonus;

  // XPをまとめて加算
  if (xpEarned > 0) {
    grantXp(xpEarned);
    state.todayStudied = true;
    if (state.lastDate !== getTodayStr()) state.streak++;
    updateTopBar(); saveState();
    maybeShowStreakToast();
  }

  const emoji = perfect ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : pct >= 40 ? '💪' : '📖';
  const msg   = perfect ? '完璧！全問正解！ボーナスXPゲット！'
              : pct >= 80 ? 'すごい！あと少しで満点！'
              : pct >= 60 ? 'なかなか良い！苦手な単語を復習しよう'
              : pct >= 40 ? 'もう少し！繰り返し練習しよう'
              : '単語帳で練習してから再挑戦！';

  // 正答率バーのグラデーション色
  const barColor = pct === 100 ? '#FFD700' : pct >= 60 ? '#4CAF50' : pct >= 40 ? '#FF9500' : '#FF3B30';

  const el = document.getElementById('screenVocab');
  el.innerHTML = `
    <div class="result-wrap" style="margin-top:20px">
      <div class="result-lv-label">${tm_size}問テスト完了</div>
      <div style="font-size:52px;margin:10px 0 4px">${emoji}</div>

      <div class="tm-result-score">${tm_correct}<span class="tm-result-denom"> / ${tm_size}</span></div>

      <div class="tm-result-bar-wrap">
        <div class="tm-result-bar">
          <div class="tm-result-bar-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="tm-result-pct" style="color:${barColor}">${pct}%</div>
      </div>

      <div class="result-msg">${msg}</div>

      <div class="tm-result-xp-box">
        <div class="tm-result-xp-row">
          <span>正解 ${tm_correct}問 × 1 XP</span>
          <span>+${tm_correct} XP</span>
        </div>
        ${perfect ? `
        <div class="tm-result-xp-row tm-result-bonus">
          <span>🏆 全問正解ボーナス</span>
          <span>+${bonus} XP</span>
        </div>` : ''}
        <div class="tm-result-xp-total">
          <span>合計</span>
          <span>+${xpEarned} XP</span>
        </div>
      </div>

      <div class="action-btns">
        <button onclick="startTestMode('${tm_deckId}',${tm_size})">もう一度</button>
        <button class="primary" onclick="showDeckDetail('${tm_deckId}')">単語帳に戻る</button>
      </div>
      ${buildMistakesHTML(tm_mistakes)}
    </div>`;
}

/* ---------- 音声読み上げ ---------- */
function speakEnglish(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // 前の読み上げを止める
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang  = 'en-US';
  utter.rate  = 0.9;
  utter.pitch = 1;
  // 英語音声を優先して選ぶ
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en') && v.localService)
                || voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utter.voice = enVoice;
  window.speechSynthesis.speak(utter);

  // ボタンのアニメーション
  const btn = document.getElementById('fcSpeakBtn');
  if (btn) {
    btn.classList.add('fc-speaking');
    utter.onend = () => btn.classList.remove('fc-speaking');
  }
}

function questSpeak(text, btn) {
  speakEnglish(text);
  if (!btn) return;
  btn.classList.add('qst-speaking');
  setTimeout(() => btn.classList.remove('qst-speaking'), 2200);
}

/* ---------- フラッシュカード学習 ---------- */
let fc_deckId, fc_dir, fc_pool, vfc_idx, fc_known, fc_unknown, vfc_flipped;

function startFlashcard(deckId, dir) {
  const decks = loadDecks();
  const deck  = decks.find(d => d.id === deckId);
  if (!deck || deck.cards.length === 0) return;

  fc_deckId  = deckId;
  fc_dir     = dir;
  fc_pool    = shuffle([...deck.cards]);
  vfc_idx     = 0;
  fc_known   = 0;
  fc_unknown = 0;
  vfc_flipped = false;

  renderVocabFC();
}

function renderVocabFC() {
  const decks   = loadDecks();
  const deck    = decks.find(d => d.id === fc_deckId);
  const card    = fc_pool[vfc_idx];
  const total   = fc_pool.length;
  const pct     = Math.round(vfc_idx / total * 100);

  // 表示方向を決定
  let dir = fc_dir;
  if (dir === 'random') dir = Math.random() < 0.5 ? 'jp2en' : 'en2jp';
  const frontText = dir === 'jp2en' ? card.jp : card.en;
  const backText  = dir === 'jp2en' ? card.en : card.jp;
  const frontLang = dir === 'jp2en' ? '日本語' : '英語';
  const backLang  = dir === 'jp2en' ? '英語' : '日本語';
  const enText    = card.en; // 常に英語テキストを保持
  const frontIsEn = dir === 'en2jp'; // 表面が英語かどうか

  // 🔊ボタン：英語側に表示
  const speakBtn = `<button class="fc-speak-btn" id="fcSpeakBtn" data-speak="${esc(enText)}" onclick="speakEnglish(this.dataset.speak);event.stopPropagation()" title="発音を聞く"><i class="ti ti-volume"></i></button>`;

  const el = document.getElementById('screenVocab');
  el.innerHTML = `
    <button class="back-btn" onclick="showDeckDetail('${fc_deckId}')">
      <i class="ti ti-arrow-left"></i> ${esc(deck.name)}
    </button>
    <div class="fc-header">
      <span class="fc-progress-text">${vfc_idx + 1} / ${total}</span>
    </div>
    <div class="fc-prog-track"><div class="fc-prog-fill" style="width:${pct}%"></div></div>

    <div class="fc-card-wrap" id="fcCardWrap" onclick="flipVocabCard()">
      <div class="fc-card ${vfc_flipped ? 'fc-flipped' : ''}" id="fcCard">
        <div class="fc-face fc-front">
          <div class="fc-lang-badge">${frontLang}</div>
          <div class="fc-word">${esc(frontText)}</div>
          ${frontIsEn ? speakBtn : ''}
          ${!frontIsEn ? `<div class="fc-tap-hint"><i class="ti ti-hand-finger"></i> タップして答えを見る</div>` : ''}
        </div>
        <div class="fc-face fc-back">
          <div class="fc-lang-badge fc-lang-badge-back">${backLang}</div>
          <div class="fc-word fc-word-answer">${esc(backText)}</div>
          ${!frontIsEn ? speakBtn : ''}
          ${card.known ? '<div class="fc-known-mark">✓ 習得済み</div>' : ''}
        </div>
      </div>
    </div>

    <div class="fc-hint" id="fcHint" style="${vfc_flipped ? 'display:none' : ''}">カードをタップして答えを確認</div>

    <div class="fc-actions" id="fcActions" style="${vfc_flipped ? '' : 'display:none'}">
      <button class="fc-btn-next" onclick="nextVocabCard()">
        ${vfc_idx + 1 < fc_pool.length ? '次のカード <i class="ti ti-chevron-right"></i>' : '完了 <i class="ti ti-check"></i>'}
      </button>
    </div>`;

  // 英語が表面なら表示と同時に自動読み上げ
  if (frontIsEn) {
    setTimeout(() => speakEnglish(enText), 300);
  }
}

function flipVocabCard() {
  if (vfc_flipped) return;
  vfc_flipped = true;
  const card   = document.getElementById('fcCard');
  const hint   = document.getElementById('fcHint');
  const actions= document.getElementById('fcActions');
  if (card)    card.classList.add('fc-flipped');
  if (hint)    hint.style.display = 'none';
  if (actions) actions.style.display = 'flex';

  // 裏面が英語（日→英モード）なら めくった瞬間に読み上げ
  if (fc_dir === 'jp2en' || fc_dir === 'random') {
    setTimeout(() => speakEnglish(fc_pool[vfc_idx].en), 400);
  }
}

function nextVocabCard() {
  vfc_idx++;
  vfc_flipped = false;
  if (vfc_idx >= fc_pool.length) {
    showVocabFCResult();
  } else {
    renderVocabFC();
  }
}

function showVocabFCResult() {
  const total = fc_pool.length;
  const el = document.getElementById('screenVocab');
  el.innerHTML = `
    <div class="result-wrap" style="margin-top:20px">
      <div class="result-lv-label">フラッシュカード完了</div>
      <div style="font-size:44px;margin:10px 0 2px">🎉</div>
      <div class="result-score">${total}<span style="font-size:22px;font-weight:400;color:var(--text-secondary)"> 語完了</span></div>
      <div class="result-msg">お疲れ様！繰り返し練習しよう 💪</div>
      <div class="action-btns">
        <button onclick="startFlashcard('${fc_deckId}','${fc_dir}')">もう一度</button>
        <button class="primary" onclick="showDeckDetail('${fc_deckId}')">単語帳に戻る</button>
      </div>
    </div>`;
}

/* =============================================
   English Quest モード
   ============================================= */
const QUEST_SCORE_KEY = 'eq_quest_scores_v1';
const QUEST_POINTS = {
  phrase_input: { ok: 15, ng: -1 },
  word_input:   { ok: 10, ng: -2 },
  qz1:          { ok: 7,  ng: -3 },
  qz3:          { ok: 5,  ng: -4 },
};

function loadQuestScores() {
  try { return JSON.parse(localStorage.getItem(QUEST_SCORE_KEY) || '{}'); } catch(e) { return {}; }
}
function saveQuestScores(scores) {
  localStorage.setItem(QUEST_SCORE_KEY, JSON.stringify(scores));
}
function getQuestBestKey(level, time) { return `${level}_${time}`; }
function getQuestBest(level, time) {
  const scores = loadQuestScores();
  return scores[getQuestBestKey(level, time)] || 0;
}
function updateQuestBest(level, time, score) {
  const scores = loadQuestScores();
  const key = getQuestBestKey(level, time);
  const prev = scores[key] || 0;
  if (score > prev) {
    scores[key] = score;
    saveQuestScores(scores);
    // Firebaseにも同期
    if (window.FB && window.FB.isRegistered()) {
      window.FB.syncQuestScores(scores);
    }
    return true;
  }
  return false;
}

/* ---------- Normalの問題プール生成 ---------- */
function buildNormalPool() {
  const pool = [];
  LEVELS.forEach(lv => {
    lv.sets.forEach(set => {
      set.forEach(q => {
        if (q.type === 'word') {
          // 4択→1択と3択の両方を生成
          pool.push({ qtype: 'qz1', jp: q.jp, en: q.en, opts: q.opts });
          pool.push({ qtype: 'qz3', jp: q.jp, en: q.en, opts: q.opts });
        } else if (q.type === 'fill') {
          pool.push({ qtype: 'word_input', jp: q.jp, en: q.answer, hint: q.template });
        }
      });
    });
  });
  // phrases.jsからフレーズ入力
  if (typeof CONVO_LEVELS !== 'undefined') {
    CONVO_LEVELS.forEach(lv => {
      lv.phrases.forEach(p => {
        pool.push({ qtype: 'phrase_input', jp: p.jp, en: p.answers[0] });
      });
    });
  }
  return shuffle(pool);
}

/* ---------- Specialの問題プール生成 ---------- */
function buildSpecialPool() {
  const pool = [];
  if (typeof QUEST_SPECIAL === 'undefined') return pool;
  QUEST_SPECIAL.forEach(q => {
    if (q.type === 'qz1') {
      pool.push({ qtype: 'qz1', jp: q.jp, en: q.en, opts: q.opts });
      // 3択版も追加（選択肢を3つに絞る）
      pool.push({ qtype: 'qz3', jp: q.jp, en: q.en, opts: q.opts });
    } else if (q.type === 'word_input') {
      pool.push({ qtype: 'word_input', jp: q.jp, en: q.en });
    } else if (q.type === 'irreg_past') {
      // 過去形を答えさせる
      pool.push({ qtype: 'word_input', jp: `「${q.base}」の過去形は？`, en: q.past });
      // 過去分詞を答えさせる
      pool.push({ qtype: 'word_input', jp: `「${q.base}」の過去分詞は？`, en: q.pp });
    }
  });
  return shuffle(pool);
}

/* ---------- Masterの問題プール生成（全問題）---------- */
function buildMasterPool() {
  const normal = buildNormalPool();
  const special = buildSpecialPool();
  return shuffle([...normal, ...special]);
}

/* ---------- Quest状態変数 ---------- */
let qst_level, qst_time, qst_pool, qst_idx, qst_score, qst_answered;
let qst_timerID, qst_timeLeft, qst_qcount, qst_correct, qst_wrong;
let qst_mistakes, qst_xpGranted, qst_review_idx;

/* ---------- Quest ホーム ---------- */
function showQuestHome() {
  showScreen('screenQuest');
  renderQuestHome();
}

function renderQuestHome() {
  const el = document.getElementById('screenQuest');
  const allLevels = [
    { id: 'normal',  icon: '📚', name: 'Normal',  desc: '既存の問題からランダム出題', times: [60], poolFn: buildNormalPool },
    { id: 'special', icon: '⭐', name: 'Special', desc: 'TOEIC・不規則動詞・生活英語', times: [60], poolFn: buildSpecialPool },
    { id: 'master',  icon: '👑', name: 'Master',  desc: '全問題からランダム出題！最難関', times: [60, 180], poolFn: buildMasterPool, isMaster: true },
  ];

  const scoreRows = allLevels.map(lv =>
    lv.times.map(t => {
      const best = getQuestBest(lv.id, t);
      return `<div class="quest-score-cell">
        <div class="quest-score-label">${lv.name} ${t/60}min</div>
        <div class="quest-score-val">${best > 0 ? best.toLocaleString() : '---'}</div>
      </div>`;
    }).join('')
  ).join('');

  const levelBtns = allLevels.map(lv => `
    <button class="quest-level-btn ${lv.isMaster ? 'quest-level-master' : 'quest-level-' + lv.id}" onclick="selectQuestLevel('${lv.id}')">
      <span class="quest-level-icon">${lv.icon}</span>
      <span class="quest-level-name">${lv.name}${lv.isMaster ? ' <span class=\"master-badge\">🏆 Ranking</span>' : ''}</span>
      <span class="quest-level-desc">${lv.desc}</span>
      <span class="quest-level-count">${lv.poolFn().length}問</span>
    </button>`).join('');

  el.innerHTML = `
    <div class="quest-home-wrap">
      <button class="back-btn" onclick="showHome()" style="margin-bottom:8px">
        <i class="ti ti-arrow-left"></i> ホームに戻る
      </button>
      <div class="quest-title-block">
        <div class="quest-title-icon">⚡</div>
        <div class="quest-title-text">English Quest</div>
        <div class="quest-title-sub">タイムアタック！正解でポイント獲得</div>
      </div>
      <div class="quest-best-box">
        <div class="quest-best-label"><i class="ti ti-trophy"></i> Best Scores</div>
        <div class="quest-score-grid">${scoreRows}</div>
      </div>
      <div class="quest-point-table">
        <div class="quest-pt-title">ポイントルール</div>
        <div class="quest-pt-row"><span>フレーズ入力</span><span class="quest-pt-ok">+15</span><span class="quest-pt-ng">-1</span></div>
        <div class="quest-pt-row"><span>単語入力</span><span class="quest-pt-ok">+10</span><span class="quest-pt-ng">-2</span></div>
        <div class="quest-pt-row"><span>1択クイズ</span><span class="quest-pt-ok">+7</span><span class="quest-pt-ng">-3</span></div>
        <div class="quest-pt-row"><span>3択クイズ</span><span class="quest-pt-ok">+5</span><span class="quest-pt-ng">-4</span></div>
      </div>
      <div class="quest-select-section">
        <div class="quest-select-label">レベルを選択</div>
        <div class="quest-level-row">${levelBtns}</div>
      </div>
    </div>`;
}

function selectQuestLevel(level) {
  const el = document.getElementById('screenQuest');
  const icons = { normal: '📚', special: '⭐', master: '👑' };
  const names = { normal: 'Normal', special: 'Special', master: 'Master' };
  const isMaster = level === 'master';
  const best60  = getQuestBest(level, 60);
  const best180 = getQuestBest(level, 180);

  const masterNote = isMaster
    ? `<div style="background:#FFF5E6;border-radius:10px;padding:10px;margin:10px 0;font-size:13px;color:#FF9500;">
        🏆 <strong>3minのスコアはランキングに反映されます！</strong>
       </div>`
    : '';

  const timeCards = isMaster ? `
    <div class="quest-time-card" onclick="startQuest('${level}',60)">
      <div class="quest-time-num">1<span>min</span></div>
      <div class="quest-time-desc">練習モード</div>
      <div class="quest-time-best">Best: ${best60 > 0 ? best60.toLocaleString() : '---'}</div>
    </div>
    <div class="quest-time-card" onclick="startQuest('${level}',180)" style="border:2px solid #FF9500">
      <div class="quest-time-num" style="color:#FF9500">3<span>min</span></div>
      <div class="quest-time-desc" style="color:#FF9500">🏆 ランキング対象</div>
      <div class="quest-time-best">Best: ${best180 > 0 ? best180.toLocaleString() : '---'}</div>
    </div>` : `
    <div class="quest-time-card" onclick="startQuest('${level}',60)">
      <div class="quest-time-num">1<span>min</span></div>
      <div class="quest-time-desc">サクッと1分勝負</div>
      <div class="quest-time-best">Best: ${best60 > 0 ? best60.toLocaleString() : '---'}</div>
    </div>`;

  el.innerHTML = `
    <div class="quest-home-wrap">
      <button class="back-btn" onclick="renderQuestHome()" style="margin-bottom:8px">
        <i class="ti ti-arrow-left"></i> 戻る
      </button>
      <div class="quest-title-block">
        <div class="quest-title-icon">${icons[level]}</div>
        <div class="quest-title-text">${names[level]} Level</div>
        <div class="quest-title-sub">時間を選んでスタート！</div>
      </div>
      ${masterNote}
      <div class="quest-time-cards">${timeCards}</div>
    </div>`;
}

/* ---------- Quest スタート ---------- */
function startQuest(level, time) {
  qst_level    = level;
  qst_time     = time;
  qst_timeLeft = time;
  qst_score    = 0;
  qst_idx      = 0;
  qst_qcount   = 0;
  qst_correct  = 0;
  qst_wrong    = 0;
  qst_answered = false;
  qst_mistakes = [];
  qst_xpGranted = false;
  if (level === 'master') qst_pool = buildMasterPool();
  else if (level === 'special') qst_pool = buildSpecialPool();
  else qst_pool = buildNormalPool();
  if (qst_pool.length === 0) {
    alert('問題データがありません');
    return;
  }
  renderQuestQ();
  startQuestTimer();
}

function startQuestTimer() {
  if (qst_timerID) clearInterval(qst_timerID);
  qst_timerID = setInterval(() => {
    qst_timeLeft--;
    updateQuestTimer();
    if (qst_timeLeft <= 0) {
      clearInterval(qst_timerID);
      qst_timerID = null;
      showQuestResult();
    }
  }, 1000);
}

function updateQuestTimer() {
  const el = document.getElementById('qstTimer');
  if (!el) return;
  el.textContent = qst_timeLeft;
  el.className = 'qst-timer-num' + (qst_timeLeft <= 10 ? ' qst-timer-danger' : '');
}

/* ---------- Quest 問題描画 ---------- */
function renderQuestQ() {
  if (qst_idx >= qst_pool.length) {
    // プールを使い切ったら再シャッフル
    qst_pool = qst_level === 'normal' ? buildNormalPool() : buildSpecialPool();
    qst_idx  = 0;
  }
  qst_answered = false;
  const q   = qst_pool[qst_idx];
  const el  = document.getElementById('screenQuest');
  const pts = QUEST_POINTS[q.qtype] || QUEST_POINTS.qz1;

  // タイマーバー幅
  const timerPct = Math.round(qst_timeLeft / qst_time * 100);
  const timerColor = qst_timeLeft <= 10 ? '#FF3B30' : qst_timeLeft <= 20 ? '#FF9500' : '#34C759';

  let questionHTML = '';

  if (q.qtype === 'qz1') {
    const opts = shuffle([...q.opts]).slice(0, 4);
    if (!opts.includes(q.en)) { opts[0] = q.en; }
    window._questOpts = shuffle(opts);
    questionHTML = `<div class="qst-opts qst-opts-4">${window._questOpts.map((o,i) =>
      `<button class="qst-opt" data-qidx="${i}" onclick="checkQuestAnswerByIdx(this,${i},'${q.qtype}')">${esc(o)}</button>`
    ).join('')}</div>`;
  } else if (q.qtype === 'qz3') {
    let opts3 = shuffle([...q.opts]).filter(o => o !== q.en).slice(0, 2);
    window._questOpts = shuffle([q.en, ...opts3]);
    questionHTML = `<div class="qst-opts qst-opts-3">${window._questOpts.map((o,i) =>
      `<button class="qst-opt" data-qidx="${i}" onclick="checkQuestAnswerByIdx(this,${i},'${q.qtype}')">${esc(o)}</button>`
    ).join('')}</div>`;
  } else {
    // word_input / phrase_input
    const hint = q.hint ? `<div class="qst-hint">${esc(q.hint)}</div>` : '';
    questionHTML = `
      ${hint}
      <div class="qst-input-wrap">
        <input class="qst-input" id="qstInput" placeholder="英語を入力..."
          autocomplete="off" autocapitalize="off" spellcheck="false">
      </div>
      <button class="qst-submit-btn" onclick="checkQuestInput()">
        <i class="ti ti-arrow-right"></i> 確認する
      </button>`;
  }

  const typeLabel = {
    phrase_input:'フレーズ入力', word_input:'単語入力', qz1:'1択クイズ', qz3:'3択クイズ'
  }[q.qtype] || '';

  el.innerHTML = `
    <div class="qst-wrap">
      <div class="qst-top">
        <div class="qst-score-display">
          <span class="qst-score-num" id="qstScore">${qst_score.toLocaleString()}</span>
          <span class="qst-score-label">pts</span>
        </div>
        <div class="qst-timer-wrap">
          <span class="qst-timer-num ${qst_timeLeft <= 10 ? 'qst-timer-danger' : ''}" id="qstTimer">${qst_timeLeft}</span>
          <span class="qst-timer-label">sec</span>
        </div>
        <div class="qst-counts">
          <span class="qst-count-ok"><i class="ti ti-check"></i>${qst_correct}</span>
          <span class="qst-count-ng"><i class="ti ti-x"></i>${qst_wrong}</span>
        </div>
      </div>
      <div class="qst-timer-bar-wrap">
        <div class="qst-timer-bar" id="qstTimerBar" style="width:${timerPct}%;background:${timerColor}"></div>
      </div>

      <div class="qst-q-card">
        <div class="qst-type-badge">${typeLabel} <span class="qst-pts-hint">+${pts.ok} / ${pts.ng}</span></div>
        <div class="qst-q-text">${esc(q.jp)}</div>
      </div>

      ${questionHTML}
      <div class="qst-feedback" id="qstFeedback"></div>
    </div>`;

  // 入力モードはフォーカス＋Enter対応
  if (q.qtype === 'word_input' || q.qtype === 'phrase_input') {
    setTimeout(() => {
      const inp = document.getElementById('qstInput');
      if (inp) {
        inp.focus();
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter' && !qst_answered) checkQuestInput();
        });
      }
    }, 80);
  }
}

/* ---------- 回答チェック ---------- */
function checkQuestAnswerByIdx(btn, chosenIdx, qtype) {
  if (qst_answered) return;
  qst_answered = true;
  const opts    = window._questOpts || [];
  const chosen  = opts[chosenIdx];
  const correct = qst_pool[qst_idx].en;
  const ok      = chosen === correct;
  const pts     = QUEST_POINTS[qtype];
  document.querySelectorAll('.qst-opt').forEach(b => {
    b.disabled = true;
    const bVal = opts[parseInt(b.dataset.qidx)];
    if (bVal === correct) b.classList.add('qst-opt-correct');
    else if (b === btn && !ok) b.classList.add('qst-opt-wrong');
  });
  applyQuestResult(ok, pts, correct, ok ? '' : chosen);
}
function checkQuestAnswer(btn, chosen, correct, qtype) {
  const idx = (window._questOpts||[]).indexOf(chosen);
  checkQuestAnswerByIdx(btn, idx >= 0 ? idx : 0, qtype);
}

function checkQuestInput() {
  if (qst_answered) return;
  const q      = qst_pool[qst_idx];
  const correct = q.en;
  const qtype  = q.qtype;
  const rawVal = (document.getElementById('qstInput')?.value || '').trim();
  const val    = rawVal.toLowerCase();
  const correctOptions = correct.split(/\s+or\s+/i).map(s => s.trim());
  const ok = correctOptions.some(c =>
    val === c.toLowerCase() || normalizeAns(val) === normalizeAns(c)
  );
  qst_answered = true;
  const inp = document.getElementById('qstInput');
  if (inp) inp.disabled = true;
  document.querySelector('.qst-submit-btn')?.setAttribute('disabled','');
  let punctHint = '';
  if (ok) {
    const matchedCorrect = correctOptions.find(c =>
      normalizeAns(val) === normalizeAns(c) && val !== c.toLowerCase()
    );
    if (matchedCorrect) {
      punctHint = `<span class="qst-punct-hint">（正確には「${esc(matchedCorrect)}」）</span>`;
    }
  }
  const pts = QUEST_POINTS[qtype];
  applyQuestResult(ok, pts, correct, ok ? '' : rawVal, punctHint);
}

function recordQuestMistake(correct, userAnswer) {
  const q = qst_pool[qst_idx];
  if (!q) return;
  const key = q.jp + '|' + correct;
  if (qst_mistakes.some(m => m.jp + '|' + m.en === key)) return;
  qst_mistakes.push({
    jp: q.jp, en: correct, userAnswer: userAnswer || '',
    qtype: q.qtype, hint: q.hint || '',
  });
}

function applyQuestResult(ok, pts, correct, userAnswer, punctHint = '') {
  const delta = ok ? pts.ok : pts.ng;
  qst_score = Math.max(0, qst_score + delta);
  if (ok) qst_correct++;
  else { qst_wrong++; recordQuestMistake(correct, userAnswer); }
  qst_qcount++;

  // スコア表示更新
  const scoreEl = document.getElementById('qstScore');
  if (scoreEl) scoreEl.textContent = qst_score.toLocaleString();

  // フィードバック
  const fb = document.getElementById('qstFeedback');
  if (fb) {
    fb.className = 'qst-feedback ' + (ok ? 'qst-fb-ok' : 'qst-fb-ng');
    fb.innerHTML = ok
      ? `<i class="ti ti-circle-check"></i> 正解！ ${punctHint}<span class="qst-delta">+${pts.ok}</span>`
      : `<i class="ti ti-circle-x"></i> 不正解。<span class="qst-answer">${esc(correct)}</span>
         <button type="button" class="qst-speak-btn" data-speak="${esc(correct)}" onclick="questSpeak(this.dataset.speak,this)" title="発音を聞く">
           <i class="ti ti-volume"></i></button>
         <span class="qst-delta qst-delta-ng">${pts.ng}</span>`;
    fb.style.display = 'flex';
  }

  // 0.7秒後に次の問題
  setTimeout(() => {
    if (qst_timeLeft > 0) {
      qst_idx++;
      renderQuestQ();
    }
  }, 700);
}

/* ---------- Quest 結果・復習 ---------- */
const QST_TYPE_LABEL = {
  phrase_input: 'フレーズ入力', word_input: '単語入力', qz1: '1択クイズ', qz3: '3択クイズ',
};

function buildQuestMistakesListHTML() {
  if (!qst_mistakes.length) return '';
  const items = qst_mistakes.map(m => {
    const userLine = m.userAnswer
      ? `<div class="quest-mistake-user">× ${esc(m.userAnswer)}</div>`
      : '';
    return `
    <div class="quest-mistake-item">
      <div class="quest-mistake-jp">${esc(m.jp)}</div>
      ${userLine}
      <div class="quest-mistake-answer">
        <span class="quest-mistake-correct">○ ${esc(m.en)}</span>
        <button type="button" class="qst-speak-btn" data-speak="${esc(m.en)}" onclick="questSpeak(this.dataset.speak,this)" title="発音を聞く">
          <i class="ti ti-volume"></i>
        </button>
      </div>
    </div>`;
  }).join('');
  return `
    <div class="quest-mistakes-section">
      <div class="quest-mistakes-title"><i class="ti ti-alert-circle"></i> 間違えた問題（${qst_mistakes.length}）</div>
      <div class="quest-mistakes-list">${items}</div>
    </div>`;
}

function showQuestResult() {
  if (qst_timerID) { clearInterval(qst_timerID); qst_timerID = null; }

  const isNew   = updateQuestBest(qst_level, qst_time, qst_score);
  const best    = getQuestBest(qst_level, qst_time);
  const pct     = qst_qcount > 0 ? Math.round(qst_correct / qst_qcount * 100) : 0;
  const emoji   = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';

  let xpGain = 0;
  if (!qst_xpGranted) {
    xpGain = Math.floor(qst_score / 10);
    if (xpGain > 0) {
      grantXp(xpGain);
      state.todayStudied = true;
      if (state.lastDate !== getTodayStr()) state.streak++;
      updateTopBar(); saveState();
      maybeShowStreakToast();
    }
    // Master 3min → 週間スコアランキングに反映
    if (qst_level === 'master' && qst_time === 180) {
      const prev = state.masterWeekScore || 0;
      if (qst_score > prev) {
        state.masterWeekScore = qst_score;
        saveState();
      }
    }
    qst_xpGranted = true;
  }

  const mistakesHTML = buildQuestMistakesListHTML();
  const reviewBtn = qst_mistakes.length > 0
    ? `<button class="primary" onclick="startQuestReview()"><i class="ti ti-book-2"></i> 間違えた問題を復習</button>`
    : '';

  const el = document.getElementById('screenQuest');
  el.innerHTML = `
    <div class="quest-result-wrap">
      <div class="quest-result-level">${qst_level === 'normal' ? 'Normal' : qst_level === 'special' ? 'Special' : '👑 Master'} · ${qst_time/60}分</div>
      <div class="quest-result-emoji">${emoji}</div>
      <div class="quest-result-score">${qst_score.toLocaleString()}<span class="quest-result-pts">pts</span></div>
      ${isNew ? `<div class="quest-result-new">🎊 NEW BEST SCORE!</div>` : `<div class="quest-result-best">Best: ${best.toLocaleString()}</div>`}

      <div class="quest-result-stats">
        <div class="quest-result-stat">
          <div class="quest-result-stat-val">${qst_qcount}</div>
          <div class="quest-result-stat-label">問題数</div>
        </div>
        <div class="quest-result-stat">
          <div class="quest-result-stat-val" style="color:var(--success-text)">${qst_correct}</div>
          <div class="quest-result-stat-label">正解</div>
        </div>
        <div class="quest-result-stat">
          <div class="quest-result-stat-val" style="color:var(--danger-text)">${qst_wrong}</div>
          <div class="quest-result-stat-label">不正解</div>
        </div>
        <div class="quest-result-stat">
          <div class="quest-result-stat-val">${pct}%</div>
          <div class="quest-result-stat-label">正答率</div>
        </div>
      </div>

      ${xpGain > 0 ? `<div class="quest-result-xp">+${xpGain} XP 獲得！</div>` : ''}
      ${mistakesHTML}

      <div class="action-btns" style="margin-top:16px">
        ${reviewBtn}
        <button onclick="startQuest('${qst_level}',${qst_time})">もう一度</button>
        <button onclick="showQuestHome()">戻る</button>
      </div>
    </div>`;
}

function startQuestReview() {
  if (!qst_mistakes.length) return;
  qst_review_idx = 0;
  renderQuestReview();
}

function renderQuestReview() {
  const m = qst_mistakes[qst_review_idx];
  const total = qst_mistakes.length;
  const typeLabel = QST_TYPE_LABEL[m.qtype] || '';
  const userRow = m.userAnswer
    ? `<div class="quest-review-row quest-review-wrong">
         <div class="quest-review-label">あなたの回答</div>
         <div class="quest-review-user">${esc(m.userAnswer)}</div>
       </div>`
    : '';
  const hintRow = m.hint ? `<div class="quest-review-hint">${esc(m.hint)}</div>` : '';

  const el = document.getElementById('screenQuest');
  el.innerHTML = `
    <div class="quest-review-wrap">
      <button class="back-btn" onclick="showQuestResult()" style="margin-bottom:8px">
        <i class="ti ti-arrow-left"></i> 結果に戻る
      </button>
      <div class="quest-review-progress">${qst_review_idx + 1} / ${total}</div>
      <div class="quest-review-bar">
        <div class="quest-review-bar-fill" style="width:${Math.round((qst_review_idx + 1) / total * 100)}%"></div>
      </div>

      <div class="quest-review-card">
        <div class="quest-review-type">${typeLabel}</div>
        <div class="quest-review-jp">${esc(m.jp)}</div>
        ${hintRow}
        ${userRow}
        <div class="quest-review-answer-row">
          <div class="quest-review-label">正解</div>
          <div class="quest-review-en">${esc(m.en)}</div>
          <button type="button" class="qst-speak-btn qst-speak-btn-lg" data-speak="${esc(m.en)}" onclick="questSpeak(this.dataset.speak,this)" title="発音を聞く">
            <i class="ti ti-volume"></i> 発音
          </button>
        </div>
      </div>

      <div class="quest-review-nav">
        <button onclick="questReviewPrev()" ${qst_review_idx === 0 ? 'disabled' : ''}>
          <i class="ti ti-chevron-left"></i> 前へ
        </button>
        ${qst_review_idx < total - 1
          ? `<button class="primary" onclick="questReviewNext()">次へ <i class="ti ti-chevron-right"></i></button>`
          : `<button class="primary" onclick="showQuestResult()">完了</button>`}
      </div>
    </div>`;

  setTimeout(() => questSpeak(m.en, document.querySelector('.qst-speak-btn-lg')), 400);
}

function questReviewPrev() {
  if (qst_review_idx > 0) { qst_review_idx--; renderQuestReview(); }
}

function questReviewNext() {
  if (qst_review_idx < qst_mistakes.length - 1) { qst_review_idx++; renderQuestReview(); }
}

/* =============================================
   その他・統計画面
   ============================================= */
function showStats() {
  showScreen('screenStats');
  const el = document.getElementById('screenStats');
  // 日別XPグラフデータ（直近7日）
  const dailyXpData = JSON.parse(localStorage.getItem('le2_daily_xp') || '{}');
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
    const key = d.toLocaleDateString('ja-JP');
    const dayNames = ['日','月','火','水','木','金','土'];
    last7.push({ label: i === 0 ? '今日' : dayNames[d.getDay()], xp: dailyXpData[key] || 0, isToday: i === 0 });
  }
  const maxXp = Math.max(...last7.map(d => d.xp), 1);
  const barChartHTML = last7.map(d => `
    <div class="bar-col">
      <div class="bar-fill${d.isToday ? ' today' : ''}" style="height:${Math.round(d.xp/maxXp*100)}%"></div>
      <div class="bar-label">${d.label}</div>
    </div>`).join('');

  const XP_PER_MIN  = 1000 / 30;           // 1000XP = 30分
  const totalMins   = state.totalXp / XP_PER_MIN;

  let timeStr;
  if (totalMins < 60) {
    timeStr = `${Math.round(totalMins)}<span class="stats-unit">分</span>`;
  } else {
    const decimal = Math.round(totalMins / 60 * 10) / 10;
    timeStr = `${decimal}<span class="stats-unit">時間</span>`;
  }

  // モチベーションメッセージ
  const h = totalMins / 60;
  let motivMsg, motivIcon;
  if (h < 1)       { motivMsg = 'まだまだこれから！毎日続けよう 🌱';      motivIcon = 'ti-seedling'; }
  else if (h < 5)  { motivMsg = '良いスタート！習慣になってきた 🔥';       motivIcon = 'ti-flame'; }
  else if (h < 10) { motivMsg = '着実に積み上げてる。この調子！ 💪';       motivIcon = 'ti-trending-up'; }
  else if (h < 20) { motivMsg = 'すごい努力量だ。英語力が伸びてる！ ⭐';   motivIcon = 'ti-star'; }
  else if (h < 50) { motivMsg = 'もう上級者の域に入ってきた！ 🚀';         motivIcon = 'ti-rocket'; }
  else             { motivMsg = 'レジェンド級の学習量。本物だ 👑';          motivIcon = 'ti-crown'; }

  // クリア済みセット数
  const clearedCount = Object.values(state.clearedSets).reduce((sum, arr) => sum + arr.length, 0);
  const totalSets    = LEVELS.reduce((sum, lv) => sum + lv.sets.length, 0);

  // CEFRレベル定義（累計時間の下限で判定）
  const CEFR = [
    { level: 'A1', label: '初めての単語や挨拶レベル',          minH: 0,    maxH: 100,  nextH: 100,  color: '#8E8E93' },
    { level: 'A2', label: '日常生活の基本的なやり取り',        minH: 100,  maxH: 180,  nextH: 180,  color: '#34C759' },
    { level: 'B1', label: '簡単な旅行や自分の意思を伝えられる',minH: 180,  maxH: 350,  nextH: 350,  color: '#007AFF' },
    { level: 'B2', label: 'ネイティブとスムーズに会話、ビジネス対応', minH: 350, maxH: 500, nextH: 500, color: '#5856D6' },
    { level: 'C1', label: '学術的・高度なビジネスで流暢に使える', minH: 500, maxH: 700, nextH: 700, color: '#FF9500' },
    { level: 'C2', label: 'ネイティブ同等レベルの熟達者',     minH: 700,  maxH: Infinity, nextH: 1000, color: '#FF3B30' },
  ];

  // 現在のCEFRレベルを判定
  // プログレスバー：CEFR選択済みならそのレベルを起点に、未選択なら学習時間ベース
  const currentCefr = CEFR.slice().reverse().find(c => h >= c.minH) || CEFR[0];
  const baseCefr    = state.cefrLevel
    ? (CEFR.find(c => c.level === state.cefrLevel) || currentCefr)
    : currentCefr;
  const nextCefr    = CEFR[CEFR.indexOf(baseCefr) + 1];
  let progressBarHtml = '';
  if (nextCefr) {
    const pct = Math.min(100, Math.round((h - baseCefr.minH) / (nextCefr.minH - baseCefr.minH) * 100));
    const displayPct = Math.max(3, pct); // 最低3%は表示
    const hoursLeft = Math.max(0, Math.round(nextCefr.minH - h));
    progressBarHtml = `
      <div class="cefr-progress-wrap">
        <div class="cefr-progress-label">
          <span>${baseCefr.level} → ${nextCefr.level} まであと <strong>${hoursLeft}時間</strong></span>
          <span>${Math.max(0, pct)}%</span>
        </div>
        <div class="cefr-progress-track">
          <div class="cefr-progress-fill" style="width:${displayPct}%;background:${baseCefr.color}"></div>
        </div>
      </div>`;
  }

  // CEFRテーブル行
  const cefrRowsHtml = CEFR.map(c => {
    const isCurrent   = !state.cefrLevel && c.level === currentCefr.level;
    const isDone      = h >= c.minH && c.level !== currentCefr.level;
    const isSelected  = c.level === state.cefrLevel;
    return `
      <div class="cefr-row ${isCurrent ? 'cefr-row-current' : ''} ${isDone ? 'cefr-row-done' : ''} ${isSelected ? 'cefr-row-selected' : ''}">
        <div class="cefr-badge" style="background:${c.color}20;color:${c.color};border-color:${c.color}40">
          ${isCurrent ? '👉 ' : isDone ? '✅ ' : ''}${c.level}
        </div>
        <div class="cefr-desc">${c.label}${isSelected ? ' <span class="cefr-selected-tag">現在地</span>' : ''}</div>
        <div class="cefr-hours">${c.level === 'A1' ? '〜100h' : c.level === 'A2' ? '180〜200h' : c.level === 'B1' ? '350〜400h' : c.level === 'B2' ? '500〜600h' : c.level === 'C1' ? '700〜800h' : '1000〜1200h'}</div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <button class="back-btn" onclick="showHome()">
      <i class="ti ti-arrow-left"></i> ホームに戻る
    </button>
    <div class="vocab-title" style="margin-bottom:4px">統計</div>
    <div class="vocab-deck-count" style="margin-bottom:20px">学習の記録</div>

    <div class="stat-card" style="margin-bottom:14px">
      <div class="stat-card-title">📊 直近7日間のXP</div>
      <div class="bar-chart">${barChartHTML}</div>
    </div>

    <div class="stats-nickname-card">
      <div class="stats-nickname-label">ニックネーム</div>
      <div class="stats-nickname-val">${esc(localStorage.getItem('le2_nickname') || '未設定')}</div>
    </div>

    <div class="stats-hero-card">
      <div class="stats-hero-label"><i class="ti ti-clock-hour-4"></i> 累計学習時間</div>
      <div class="stats-hero-time">${timeStr}</div>
      <div class="stats-hero-sub">総合 ${state.totalXp.toLocaleString()} XP（1000XP ≈ 30分換算）</div>
      ${state.startDate ? (() => {
        const start   = parseSafeDate(state.startDate);
        const today   = new Date();
        const elapsed = Math.floor((today - start) / 86400000) + 1;
        const [y, m, d] = [start.getFullYear(), start.getMonth()+1, start.getDate()];
        return `<div class="stats-hero-since">${y}年${m}月${d}日 スタート（${elapsed}日目）</div>`;
      })() : ''}
      <div class="stats-hero-motiv">
        <i class="ti ${motivIcon}"></i> ${motivMsg}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stats-cell">
        <div class="stats-cell-val">${state.todayStudied ? state.streak + 1 : state.streak}</div>
        <div class="stats-cell-label"><i class="ti ti-flame"></i> 連続日数</div>
      </div>
      <div class="stats-cell">
        <div class="stats-cell-val">${state.xp.toLocaleString()}</div>
        <div class="stats-cell-label"><i class="ti ti-trophy"></i> 今週のXP</div>
      </div>
      <div class="stats-cell">
        <div class="stats-cell-val">${state.medals}</div>
        <div class="stats-cell-label">🥇 メダル</div>
      </div>
      <div class="stats-cell">
        <div class="stats-cell-val">${clearedCount}<span style="font-size:13px;font-weight:500;color:var(--text-secondary)"> / ${totalSets}</span></div>
        <div class="stats-cell-label"><i class="ti ti-check"></i> クリアセット</div>
      </div>
    </div>

    <div class="cefr-section">
      <div class="cefr-section-title">
        <i class="ti ti-school"></i> CEFRレベルの目安
      </div>
      <div class="cefr-section-sub">ケンブリッジ大学公式ガイドラインより</div>

      ${!state.cefrLevel ? `
      <div class="cefr-select-wrap">
        <div class="cefr-select-label"><i class="ti ti-adjustments"></i> あなたの現在のレベルは？</div>
        <div class="cefr-select-hint">選択すると対応する学習モードのロックが解除されます</div>
        <div class="cefr-select-row">
          ${['A1','A2','B1','B2','C1','C2'].map(lv => `
            <button class="cefr-select-btn"
              onclick="setCefrLevel('${lv}')">${lv}</button>
          `).join('')}
        </div>
      </div>` : ''}
      ${progressBarHtml}
      <div class="cefr-table">
        ${cefrRowsHtml}
      </div>
    </div>
  `;
}

/* =============================================
   初期化
   ============================================= */
function init() {
  loadState();
  updateClock();
  setInterval(updateClock, 60000);
  _streakToastShown = false;
  // ダークモード復元
  if (localStorage.getItem('le2_dark') === '1') {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('darkIcon');
    if (icon) { icon.classList.remove('ti-moon'); icon.classList.add('ti-sun'); }
  }
  // 初回ニックネーム設定（Firebase確認後に表示）
  if (!localStorage.getItem('le2_nickname')) {
    const checkNickname = async () => {
      if (window.FB2) {
        try {
          const uid  = window.FB2.getMyUid();
          const data = await window.FB2.getFriendData(uid);
          if (data && data.nickname) {
            localStorage.setItem('le2_nickname', data.nickname);
            return;
          }
        } catch(e) {}
        document.getElementById('nicknameModal').style.display = 'flex';
      } else {
        setTimeout(checkNickname, 300);
      }
    };
    setTimeout(checkNickname, 500);
  }
  // 週間1位メダルチェック（週が変わった時のみ）
  if (state._checkWeekRank) {
    delete state._checkWeekRank;
    checkWeekRankMedal();
  }
  showHome();
  // フレンド申請バッジ更新
  setTimeout(checkFriendBadge, 2000);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('le2_dark', isDark ? '1' : '0');
  const icon = document.getElementById('darkIcon');
  if (icon) {
    icon.classList.toggle('ti-moon', !isDark);
    icon.classList.toggle('ti-sun', isDark);
  }
}

async function saveNickname() {
  const val = (document.getElementById('nicknameInput').value || '').trim();
  if (!val) { document.getElementById('nicknameInput').focus(); return; }
  document.getElementById('nicknameModal').style.display = 'none';
  localStorage.setItem('le2_nickname', val);
  for (let i = 0; i < 15; i++) {
    if (window.FB2) { await window.FB2.registerUser(val); break; }
    await new Promise(r => setTimeout(r, 200));
  }
}


/* =============================================
   お気に入りフレーズ管理
   ============================================= */
function getFavorites() {
  return JSON.parse(localStorage.getItem('le2_favorites') || '[]');
}
function toggleFavorite(jp, en) {
  const list = getFavorites();
  const idx = list.findIndex(f => f.jp === jp && f.en === en);
  if (idx >= 0) { list.splice(idx, 1); }
  else { list.push({ jp, en, addedAt: Date.now() }); }
  localStorage.setItem('le2_favorites', JSON.stringify(list));
  return idx < 0; // true=追加, false=削除
}
function isFavorite(jp, en) {
  return getFavorites().some(f => f.jp === jp && f.en === en);
}

function showFavorites() {
  showScreen('screenFavorite');
  const el = document.getElementById('screenFavorite');
  const list = getFavorites().reverse();
  if (list.length === 0) {
    el.innerHTML = `
      <button class="back-btn" onclick="showHome()"><i class="ti ti-arrow-left"></i> ホームに戻る</button>
      <div class="fav-wrap">
        <div class="fav-title">お気に入り</div>
        <div class="fav-empty">英会話モードで♡マークを押すとここに保存されます</div>
      </div>`;
    return;
  }
  const items = list.map(f => `
    <div class="fav-item">
      <div class="fav-item-text">
        <div class="fav-item-jp">${esc(f.jp)}</div>
        <div class="fav-item-en">${esc(f.en)}</div>
      </div>
      <button class="fav-remove-btn" onclick="removeFavAndRefresh('${encodeURIComponent(f.jp)}','${encodeURIComponent(f.en)}')">
        <i class="ti ti-heart-off"></i>
      </button>
    </div>`).join('');
  el.innerHTML = `
    <button class="back-btn" onclick="showHome()"><i class="ti ti-arrow-left"></i> ホームに戻る</button>
    <div class="fav-wrap">
      <div class="fav-title">お気に入り</div>
      <div class="fav-sub">${list.length}フレーズ保存済み</div>
      ${items}
    </div>`;
}

function removeFavAndRefresh(jpEnc, enEnc) {
  toggleFavorite(decodeURIComponent(jpEnc), decodeURIComponent(enEnc));
  showFavorites();
}

/* =============================================
   全ユーザーランキング
   ============================================= */
let _rankingTab = 'total'; // 'total' | 'master'

async function showGlobalRanking() {
  showScreen('screenRanking');
  const el = document.getElementById('screenRanking');
  el.innerHTML = `<div style="text-align:center;padding:40px;color:#8E8E93">読み込み中...</div>`;
  renderRankingScreen();
}

async function renderRankingScreen() {
  const el = document.getElementById('screenRanking');
  const myUid      = window.FB2 ? window.FB2.getMyUid() : null;
  const myNickname = window.FB2 ? window.FB2.getNickname() : localStorage.getItem('le2_nickname') || 'You';
  const isMaster   = _rankingTab === 'master';
  let users = [];
  try {
    if (window.FB2) {
      users = isMaster ? await window.FB2.getMasterWeekRanking() : await window.FB2.getAllRanking();
    }
  } catch(e) { users = []; }
  const totalPlayers = users.length;
  const myIdx   = users.findIndex(u => u.uid === myUid);
  const myRank  = myIdx >= 0 ? myIdx + 1 : null;
  const myData  = myIdx >= 0 ? users[myIdx] : null;
  const myScore = myData
    ? (isMaster ? (myData.masterWeekScore||0) : (myData.totalXp||0))
    : (isMaster ? 0 : (state.totalXp||0));
  const top3    = users.slice(0, 3);
  const medals  = ['🥇','🥈','🥉'];
  const posClass = i => i===0?'gold':i===1?'silver':'bronze';
  const top5HTML = top3.length === 0
    ? `<div class="ranking-empty">まだデータがありません</div>`
    : top3.map((u,i) => `
      <div class="ranking-card${u.uid===myUid?' me':''}">
        <div class="ranking-pos ${posClass(i)}">${medals[i]}</div>
        <div class="ranking-name">${esc(u.nickname||'名無し')}</div>
        <div class="ranking-score">${(isMaster?(u.masterWeekScore||0):(u.totalXp||0)).toLocaleString()} XP</div>
      </div>`).join('');
  const myScoreLabel = myScore > 0 ? `${myScore.toLocaleString()} XP` : '0 XP';
  const myRankLabel  = myRank ? `#${myRank}` : '-';
  const mySubLabel   = myRank ? `${myScoreLabel} · ${totalPlayers}人中` : `未参加 · 参加者${totalPlayers}人`;
  const myCardHTML = `
    <div class="ranking-my-card${myRank&&myRank<=3?' ranking-my-top':''}">
      <div class="ranking-my-rank">${myRankLabel}</div>
      <div class="ranking-my-info">
        <div class="ranking-my-name">${esc(myNickname)}</div>
        <div class="ranking-my-score">${mySubLabel}</div>
      </div>
    </div>`;
  const tabDesc = isMaster ? '<div class="ranking-tab-desc">Questのマスターモードの今週のスコア（月曜リセット）</div>' : '';
  el.innerHTML = `
    <button class="back-btn" onclick="showHome()"><i class="ti ti-arrow-left"></i> ホームに戻る</button>
    <div class="ranking-wrap">
      <div class="ranking-header">
        <div class="ranking-title">🏆 ランキング</div>
        <div class="ranking-sub">参加プレイヤー ${totalPlayers}人</div>
      </div>
      <div class="ranking-tab-row">
        <button class="ranking-tab${_rankingTab==='total'?' active':''}" onclick="switchRankingTab('total')">累計XP</button>
        <button class="ranking-tab${_rankingTab==='master'?' active':''}" onclick="switchRankingTab('master')">Master週間スコア</button>
      </div>
      ${tabDesc}
      ${myCardHTML}
      <div class="ranking-top5-title">TOP 3</div>
      ${top5HTML}
    </div>`;
}

function switchRankingTab(tab) {
  _rankingTab = tab;
  const el = document.getElementById('screenRanking');
  el.innerHTML = `<div style="text-align:center;padding:40px;color:#8E8E93">読み込み中...</div>`;
  renderRankingScreen();
}



/* =============================================
   フレンド機能
   ============================================= */
async function showFriendsScreen() {
  showScreen('screenFriends');
  const el = document.getElementById('screenFriends');
  el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-tertiary)">読み込み中...</div>`;
  await renderFriendsScreen();
}

let _friendsTab = 'list';

async function renderFriendsScreen() {
  const el = document.getElementById('screenFriends');
  if (!localStorage.getItem('le2_nickname')) {
    el.innerHTML = `
      <button class="back-btn" onclick="showHome()"><i class="ti ti-arrow-left"></i> ホームに戻る</button>
      <div style="text-align:center;padding:60px 20px;color:var(--text-secondary)">
        <div style="font-size:40px;margin-bottom:12px">👋</div>
        <div style="font-weight:600;margin-bottom:8px">ニックネームを設定してください</div>
        <div style="font-size:13px">ランキング登録後にフレンド機能が使えます</div>
      </div>`;
    return;
  }
  const myUid = window.FB2 ? window.FB2.getMyUid() : null;
  const [friends, requests] = await Promise.all([
    window.FB2 ? window.FB2.getFriends().catch(()=>[]) : Promise.resolve([]),
    window.FB2 ? window.FB2.getPendingRequests().catch(()=>[]) : Promise.resolve([]),
  ]);
  const friendDataList = await Promise.all(
    friends.map(f => window.FB2 ? window.FB2.getFriendData(f.uid).catch(()=>null) : Promise.resolve(null))
  );
  const reqCount = requests.length;
  const badge = document.getElementById('friendBadge');
  if (badge) { badge.style.display = reqCount>0?'':'none'; badge.textContent = reqCount; }
  const tabs = [
    { id:'list',     label:`フレンド（${friends.length}）` },
    { id:'search',   label:'検索' },
    { id:'requests', label:`申請（${reqCount}）` },
  ];
  const tabHTML = tabs.map(t => `
    <button class="friends-tab${_friendsTab===t.id?' active':''}" onclick="switchFriendsTab('${t.id}')">
      ${t.label}${t.id==='requests'&&reqCount>0?` <span class="friends-req-badge">${reqCount}</span>`:''}
    </button>`).join('');
  let bodyHTML = '';
  if (_friendsTab === 'list') {
    bodyHTML = friends.length === 0
      ? `<div class="friends-empty"><i class="ti ti-users"></i><br>フレンドがいません<br><span>「検索」タブから追加しよう</span></div>`
      : friendDataList.map((data,i) => {
          const f = friends[i];
          const xp = data?(data.totalXp||0):0;
          const streak = data?(data.streak||0):0;
          return `
          <div class="friends-card">
            <div class="friends-avatar">${esc(f.nickname.charAt(0).toUpperCase())}</div>
            <div class="friends-info">
              <div class="friends-name">${esc(f.nickname)}</div>
              <div class="friends-meta">
                <span><i class="ti ti-chart-bar"></i> ${xp.toLocaleString()} XP</span>
                ${streak>0?`<span><i class="ti ti-flame"></i> ${streak}日連続</span>`:''}
              </div>
            </div>
            <button class="friends-remove-btn" onclick="removeFriendAndRefresh('${esc(f.uid)}')">削除</button>
          </div>`;
        }).join('');
  } else if (_friendsTab === 'search') {
    bodyHTML = `
      <div class="friends-search-wrap">
        <div class="friends-search-row">
          <input class="friends-search-input" id="friendSearchInput" placeholder="ニックネームで検索..." maxlength="12" autocomplete="off">
          <button class="friends-search-btn" onclick="doFriendSearch()"><i class="ti ti-search"></i></button>
        </div>
        <div id="friendSearchResult"></div>
      </div>`;
  } else if (_friendsTab === 'requests') {
    bodyHTML = requests.length === 0
      ? `<div class="friends-empty"><i class="ti ti-mail"></i><br>申請はありません</div>`
      : requests.map(r => `
        <div class="friends-card">
          <div class="friends-avatar">${esc(r.fromNickname.charAt(0).toUpperCase())}</div>
          <div class="friends-info">
            <div class="friends-name">${esc(r.fromNickname)}</div>
            <div class="friends-meta"><span>フレンド申請が届いています</span></div>
          </div>
          <div class="friends-req-btns">
            <button class="friends-accept-btn" onclick="acceptFriendAndRefresh('${esc(r.id)}')">承認</button>
            <button class="friends-remove-btn" onclick="rejectFriendAndRefresh('${esc(r.fromUid)}')">拒否</button>
          </div>
        </div>`).join('');
  }
  el.innerHTML = `
    <button class="back-btn" onclick="showHome()"><i class="ti ti-arrow-left"></i> ホームに戻る</button>
    <div class="friends-wrap">
      <div class="friends-header"><div class="friends-title"><i class="ti ti-users"></i> フレンド</div></div>
      <div class="friends-tab-row">${tabHTML}</div>
      <div class="friends-body">${bodyHTML}</div>
    </div>`;
}

function switchFriendsTab(tab) { _friendsTab = tab; renderFriendsScreen(); }

async function doFriendSearch() {
  const input = document.getElementById('friendSearchInput');
  const result = document.getElementById('friendSearchResult');
  if (!input||!result) return;
  const q = input.value.trim();
  if (!q) return;
  result.innerHTML = `<div class="friends-search-loading">検索中...</div>`;
  try {
    const users = await window.FB2.searchUserByNickname(q);
    const myUid = window.FB2.getMyUid();
    const filtered = users.filter(u => u.uid !== myUid);
    if (filtered.length === 0) { result.innerHTML = `<div class="friends-empty" style="padding:20px 0">見つかりませんでした</div>`; return; }
    result.innerHTML = filtered.map(u => `
      <div class="friends-card" style="margin-top:10px">
        <div class="friends-avatar">${esc(u.nickname.charAt(0).toUpperCase())}</div>
        <div class="friends-info">
          <div class="friends-name">${esc(u.nickname)}</div>
          <div class="friends-meta"><span><i class="ti ti-chart-bar"></i> ${(u.totalXp||0).toLocaleString()} XP</span></div>
        </div>
        <button class="friends-add-btn" id="add-btn-${esc(u.uid)}" onclick="sendFriendReqAndUpdate('${esc(u.uid)}','${esc(u.nickname)}')">
          <i class="ti ti-user-plus"></i> 申請
        </button>
      </div>`).join('');
  } catch(e) { result.innerHTML = `<div class="friends-empty" style="padding:20px 0">エラーが発生しました</div>`; }
}

document.addEventListener('keydown', e => {
  if (e.key==='Enter' && document.getElementById('friendSearchInput')===document.activeElement) doFriendSearch();
});

async function sendFriendReqAndUpdate(toUid, toNickname) {
  const btn = document.getElementById(`add-btn-${toUid}`);
  if (btn) { btn.disabled=true; btn.innerHTML='送信中...'; }
  try {
    await window.FB2.sendFriendRequest(toUid, toNickname);
    if (btn) { btn.innerHTML='<i class="ti ti-check"></i> 申請済み'; }
    _showMiniToast(`${toNickname} に申請しました`);
  } catch(e) {
    if (btn) { btn.disabled=false; btn.innerHTML='<i class="ti ti-user-plus"></i> 申請'; }
    _showMiniToast(e.message||'エラーが発生しました');
  }
}

async function acceptFriendAndRefresh(docId) {
  try { await window.FB2.acceptFriendRequest(docId); _showMiniToast('フレンドになりました！'); _friendsTab='list'; await renderFriendsScreen(); }
  catch(e) { _showMiniToast('エラーが発生しました'); }
}

async function rejectFriendAndRefresh(fromUid) {
  try { await window.FB2.removeFriend(fromUid); _showMiniToast('申請を拒否しました'); await renderFriendsScreen(); }
  catch(e) { _showMiniToast('エラーが発生しました'); }
}

async function removeFriendAndRefresh(uid) {
  try { await window.FB2.removeFriend(uid); _showMiniToast('フレンドを削除しました'); await renderFriendsScreen(); }
  catch(e) { _showMiniToast('エラーが発生しました'); }
}

async function checkFriendBadge() {
  if (!window.FB2||!localStorage.getItem('le2_nickname')) return;
  try {
    const reqs = await window.FB2.getPendingRequests();
    const badge = document.getElementById('friendBadge');
    if (badge) { badge.style.display=reqs.length>0?'':'none'; badge.textContent=reqs.length; }
  } catch(e) {}
}

window.addEventListener('DOMContentLoaded', init);

