const { db } = require("./firebase");
const admin = require("firebase-admin");

async function addToQueue(article) {
  return db.collection("queue").add({
    ...article,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function getQueue(limit = 10) {
  const snap = await db
    .collection("queue")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function publishFromQueue(queueId) {
  const ref = db.collection("queue").doc(queueId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const data = doc.data();
  const postRef = await db.collection("posts").add({
    ...data,
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await ref.delete();
  return postRef.id;
}

async function deletePost(postId) {
  await db.collection("posts").doc(postId).delete();
}

async function deleteFromQueue(queueId) {
  await db.collection("queue").doc(queueId).delete();
}

async function urlAlreadySeen(url) {
  const [q1, q2] = await Promise.all([
    db.collection("queue").where("sourceUrl", "==", url).limit(1).get(),
    db.collection("posts").where("sourceUrl", "==", url).limit(1).get(),
  ]);
  return !q1.empty || !q2.empty;
}

async function getSession(userId) {
  const doc = await db.collection("botSessions").doc(String(userId)).get();
  return doc.exists ? doc.data() : null;
}

async function setSession(userId, data) {
  await db.collection("botSessions").doc(String(userId)).set(data);
}

async function clearSession(userId) {
  await db.collection("botSessions").doc(String(userId)).delete();
}

module.exports = {
  addToQueue,
  getQueue,
  publishFromQueue,
  deletePost,
  deleteFromQueue,
  urlAlreadySeen,
  getSession,
  setSession,
  clearSession,
};
