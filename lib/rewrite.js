const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

async function rewriteArticle({ title, text, sourceName }) {
  if (!ANTHROPIC_KEY) {
    const teaser = text.slice(0, 220).trim();
    const body = [
      teaser + "...",
      "",
      "(Полный текст - на сайте источника, см. ссылку ниже. Настрой ANTHROPIC_API_KEY для автоматического рерайта.)"
    ].join("\n");
    return { title, body };
  }

  const promptLines = [
    "Ты - редактор новостного IT-портала Rusnet. Перепиши следующую новость ПОЛНОСТЬЮ СВОИМИ СЛОВАМИ на русском языке: сохрани факты и суть, но не копируй формулировки и структуру предложений оригинала. Не используй прямые цитаты длиннее 5-7 слов. Стиль: кратко, по делу, нейтрально. В конце не добавляй ссылку на источник - это будет добавлено отдельно.",
    "",
    "Источник: " + sourceName,
    "Заголовок оригинала: " + title,
    "Текст оригинала: " + text,
    "",
    "Ответь строго в формате:",
    "ЗАГОЛОВОК: <новый заголовок своими словами>",
    "ТЕКСТ: <переписанный текст, 2-4 абзаца>"
  ];
  const prompt = promptLines.join("\n");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await resp.json();
  const raw = (data.content || [])
    .filter(function (c) { return c.type === "text"; })
    .map(function (c) { return c.text; })
    .join("\n");

  const titleMatch = raw.match(/ЗАГОЛОВОК:\s*(.+)/);
  const bodyMatch = raw.match(/ТЕКСТ:\s*([\s\S]+)/);

  return {
    title: titleMatch ? titleMatch[1].trim() : title,
    body: bodyMatch ? bodyMatch[1].trim() : raw.trim()
  };
}

module.exports = { rewriteArticle };
