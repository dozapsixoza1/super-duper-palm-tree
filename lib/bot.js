const {
  addToQueue,
  getQueue,
  publishFromQueue,
  deletePost,
  getSession,
  setSession,
  clearSession,
} = require("./firestore");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_IDS = (process.env.TELEGRAM_ADMIN_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const API = `https://api.telegram.org/bot${TOKEN}`;

async function send(chatId, text) {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = (msg.text || "").trim();

  if (!ADMIN_IDS.includes(String(userId))) {
    await send(chatId, "У тебя нет доступа к этому боту.");
    return;
  }

  const session = await getSession(userId);

  if (session && session.step) {
    return handleNewFlowStep(userId, chatId, text, msg, session);
  }

  if (text === "/start" || text === "/help") {
    await send(
      chatId,
      "Команды:\n" +
        "/new — добавить новость вручную\n" +
        "/queue — показать очередь автопарсера\n" +
        "/publish ID — опубликовать статью из очереди\n" +
        "/delete ID — удалить опубликованную статью"
    );
    return;
  }

  if (text === "/new") {
    await setSession(userId, { step: "title" });
    await send(chatId, "Пришли заголовок новости:");
    return;
  }

  if (text === "/queue") {
    const items = await getQueue(10);
    if (!items.length) {
      await send(chatId, "Очередь пуста.");
      return;
    }
    const lines = items.map(
      (it) => `<b>${escapeHtml(it.title)}</b>\nID: <code>${it.id}</code>\nИсточник: ${it.sourceName || "вручную"}\n`
    );
    await send(chatId, lines.join("\n"));
    return;
  }

  if (text.startsWith("/publish")) {
    const id = text.split(" ")[1];
    if (!id) {
      await send(chatId, "Использование: /publish ID");
      return;
    }
    const postId = await publishFromQueue(id);
    await send(chatId, postId ? `Опубликовано ✅ (postId: ${postId})` : "Не найдено в очереди.");
    return;
  }

  if (text.startsWith("/delete")) {
    const id = text.split(" ")[1];
    if (!id) {
      await send(chatId, "Использование: /delete ID");
      return;
    }
    await deletePost(id);
    await send(chatId, "Удалено ✅");
    return;
  }

  await send(chatId, "Не понял команду. Напиши /help");
}

async function handleNewFlowStep(userId, chatId, text, msg, session) {
  if (session.step === "title") {
    session.title = text;
    session.step = "body";
    await setSession(userId, session);
    await send(chatId, "Теперь пришли текст новости:");
    return;
  }

  if (session.step === "body") {
    session.body = text;
    session.step = "category";
    await setSession(userId, session);
    await send(chatId, "Категория (например: tech, business, ai):");
    return;
  }

  if (session.step === "category") {
    session.category = text || "news";
    session.step = "image";
    await setSession(userId, session);
    await send(chatId, 'Пришли фото (или напиши "нет"):');
    return;
  }

  if (session.step === "image") {
    let imageUrl = null;
    if (msg.photo && msg.photo.length) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      imageUrl = await getTelegramFileUrl(fileId);
    }

    await addToQueue({
      title: session.title,
      body: session.body,
      category: session.category,
      image: imageUrl,
      origin: "manual",
    });

    await clearSession(userId);
    await send(chatId, "Новость добавлена в очередь ✅ Опубликуй командой /queue → /publish ID");
    return;
  }
}

async function getTelegramFileUrl(fileId) {
  const resp = await fetch(`${API}/getFile?file_id=${fileId}`);
  const data = await resp.json();
  const filePath = data.result && data.result.file_path;
  if (!filePath) return null;
  return `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
}

function escapeHtml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = { handleUpdate };
