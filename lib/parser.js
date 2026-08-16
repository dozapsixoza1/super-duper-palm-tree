const Parser = require("rss-parser");
const parser = new Parser();

const sources = require("./sources");
const { rewriteArticle } = require("./rewrite");
const { addToQueue, urlAlreadySeen } = require("./firestore");

async function parseAllFeeds() {
  if (!sources.length) {
    console.log("Нет источников в sources.js — нечего парсить.");
    return { added: 0 };
  }

  let added = 0;

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, 5);

      for (const item of items) {
        const sourceUrl = item.link;
        if (!sourceUrl) continue;
        if (await urlAlreadySeen(sourceUrl)) continue;

        const rawText = item.contentSnippet || item.content || item.title || "";

        const rewritten = await rewriteArticle({
          title: item.title || "",
          text: rawText,
          sourceName: source.name,
        });

        await addToQueue({
          title: rewritten.title,
          body: rewritten.body,
          category: source.category || "news",
          sourceName: source.name,
          sourceUrl,
          image: (item.enclosure && item.enclosure.url) || null,
          origin: "autoparser",
        });

        added++;
      }
    } catch (err) {
      console.error(`Ошибка парсинга ${source.name}:`, err.message);
    }
  }

  return { added };
}

module.exports = { parseAllFeeds };
