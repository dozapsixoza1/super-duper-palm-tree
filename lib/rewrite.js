const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

async function rewriteArticle({ title, text, sourceName }) {
  if (!ANTHROPIC_KEY) {
    const teaser = text.slice(0, 220).trim();
    return {
      title,
      body: `${teaser}...\n\n(Полный текст — на сайте источника, см. ссылку ниже. Настрой ANTHROPIC_API_KEY для автоматического рерайта.)`,
    };
  }

  const prompt = `Ты — редактор новостного IT-портала Rusnet. Перепиши следующую новость ПОЛНОСТЬЮ СВОИМИ СЛОВАМИ на русском языке: сохрани факты и суть, но не копируй формулировки и структуру предложений оригинала. Не используй прямые цитаты длиннее 5-7 слов. Стиль: кратко, по делу, нейтрально. В конце не
