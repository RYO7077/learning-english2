/* =============================================
   firebase.js — Learning English 2
   全ユーザーランキング＋フレンド機能
   ============================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, getDocs,
  updateDoc, query, orderBy, where, addDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx1SN_0DgnLGB0c1x9ekdIYCgfTv70axA",
  authDomain: "learning-english2.firebaseapp.com",
  projectId: "learning-english2",
  storageBucket: "learning-english2.firebasestorage.app",
  messagingSenderId: "208786056071",
  appId: "1:208786056071:web:e450e71a9192d19148e922",
  measurementId: "G-059FVF5SC2"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ユーザーID生成 */
function getOrCreateUserId() {
  let uid = localStorage.getItem('le2_uid');
  if (!uid) {
    uid = 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem('le2_uid', uid);
  }
  return uid;
}

/* ユーザー登録 / ニックネーム更新 */
async function registerUser(nickname) {
  const uid = getOrCreateUserId();
  const ref = doc(db, 'le2_users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      nickname,
      totalXp: 0,
      weekXp: 0,
      masterWeekScore: 0,
      weekStart: getMondayStr(),
      streak: 0,
      medals: 0,
      cefrLevel: '',
      studyHours: 0,
      updatedAt: Date.now()
    });
  } else {
    await updateDoc(ref, { nickname, updatedAt: Date.now() });
  }
  localStorage.setItem('le2_nickname', nickname);
  return { uid };
}

/* XP・スコア・フレンド表示用データをFirebaseに同期 */
async function syncToFirebase(totalXp, weekXp, masterWeekScore, extra) {
  const uid = getOrCreateUserId();
  if (!localStorage.getItem('le2_nickname')) return;
  try {
    const ref = doc(db, 'le2_users', uid);
    const data = {
      totalXp,
      weekXp,
      masterWeekScore,
      weekStart: getMondayStr(),
      updatedAt: Date.now()
    };
    if (extra) {
      if (extra.streak   !== undefined) data.streak    = extra.streak;
      if (extra.medals   !== undefined) data.medals    = extra.medals;
      if (extra.cefrLevel !== undefined) data.cefrLevel = extra.cefrLevel;
      if (extra.studyHours !== undefined) data.studyHours = extra.studyHours;
    }
    await updateDoc(ref, data);
  } catch(e) {
    console.warn('Firebase sync failed:', e);
  }
}

/* 週間XPランキング取得（weekXp順） */
async function getWeekRanking() {
  try {
    const q = query(collection(db, 'le2_users'), orderBy('weekXp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data()).filter(u => (u.weekXp || 0) > 0);
  } catch(e) {
    console.warn('Week ranking fetch failed:', e);
    return [];
  }
}

/* 全ユーザーランキング取得（累計XP順） */
async function getAllRanking() {
  try {
    const q = query(collection(db, 'le2_users'), orderBy('totalXp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch(e) {
    console.warn('Ranking fetch failed:', e);
    return [];
  }
}

/* Master週間スコアランキング取得 */
async function getMasterWeekRanking() {
  try {
    const q = query(collection(db, 'le2_users'), orderBy('masterWeekScore', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data()).filter(u => u.masterWeekScore > 0);
  } catch(e) {
    console.warn('Master ranking fetch failed:', e);
    return [];
  }
}

/* ========== フレンド機能 ========== */

/* ニックネームでユーザー検索 */
async function searchUserByNickname(nickname) {
  try {
    const q = query(collection(db, 'le2_users'), where('nickname', '==', nickname));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch(e) {
    console.warn('User search failed:', e);
    return [];
  }
}

/* フレンド申請送信 */
async function sendFriendRequest(toUid, toNickname) {
  const fromUid      = getOrCreateUserId();
  const fromNickname = localStorage.getItem('le2_nickname') || '';
  if (fromUid === toUid) throw new Error('自分自身には申請できません');

  // 既存の申請・フレンド関係を確認
  const existing = await getFriendDoc(fromUid, toUid);
  if (existing) throw new Error('すでに申請済みかフレンドです');

  await setDoc(doc(db, 'le2_friends', `${fromUid}_${toUid}`), {
    fromUid,
    fromNickname,
    toUid,
    toNickname,
    status: 'pending',   // pending | accepted
    createdAt: Date.now()
  });
}

/* フレンドドキュメント取得（双方向チェック） */
async function getFriendDoc(uid1, uid2) {
  try {
    const a = await getDoc(doc(db, 'le2_friends', `${uid1}_${uid2}`));
    if (a.exists()) return a.data();
    const b = await getDoc(doc(db, 'le2_friends', `${uid2}_${uid1}`));
    if (b.exists()) return b.data();
    return null;
  } catch(e) { return null; }
}

/* 受信した申請一覧（pending） */
async function getPendingRequests() {
  const uid = getOrCreateUserId();
  try {
    const q = query(
      collection(db, 'le2_friends'),
      where('toUid', '==', uid),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) { return []; }
}

/* フレンド申請を承認 */
async function acceptFriendRequest(docId) {
  await updateDoc(doc(db, 'le2_friends', docId), { status: 'accepted' });
}

/* フレンド申請を拒否 / フレンド削除 */
async function removeFriend(uid2) {
  const uid1 = getOrCreateUserId();
  try {
    const aRef = doc(db, 'le2_friends', `${uid1}_${uid2}`);
    const a = await getDoc(aRef);
    if (a.exists()) { await deleteDoc(aRef); return; }
    const bRef = doc(db, 'le2_friends', `${uid2}_${uid1}`);
    const b = await getDoc(bRef);
    if (b.exists()) { await deleteDoc(bRef); return; }
  } catch(e) { console.warn('removeFriend failed:', e); }
}

/* フレンド一覧取得（accepted） */
async function getFriends() {
  const uid = getOrCreateUserId();
  try {
    const q1 = query(collection(db, 'le2_friends'), where('fromUid','==', uid), where('status','==','accepted'));
    const q2 = query(collection(db, 'le2_friends'), where('toUid',  '==', uid), where('status','==','accepted'));
    const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const friends = [];
    s1.docs.forEach(d => { const data = d.data(); friends.push({ uid: data.toUid,   nickname: data.toNickname,   docId: d.id }); });
    s2.docs.forEach(d => { const data = d.data(); friends.push({ uid: data.fromUid, nickname: data.fromNickname, docId: d.id }); });
    return friends;
  } catch(e) { return []; }
}

/* フレンドの詳細データ取得 */
async function getFriendData(uid) {
  try {
    const snap = await getDoc(doc(db, 'le2_users', uid));
    return snap.exists() ? snap.data() : null;
  } catch(e) { return null; }
}

/* 月曜日の文字列 */
function getMondayStr() {
  let d = new Date();
  let day = d.getDay();
  let diff = (day === 0) ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toLocaleDateString('ja-JP');
}

/* グローバルに公開 */
window.FB2 = {
  getOrCreateUserId,
  registerUser,
  syncToFirebase,
  getAllRanking,
  getWeekRanking,
  getMasterWeekRanking,
  searchUserByNickname,
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  getFriendData,
  getNickname:   () => localStorage.getItem('le2_nickname') || '',
  isRegistered:  () => !!localStorage.getItem('le2_nickname'),
  getMyUid:      () => getOrCreateUserId(),
};
