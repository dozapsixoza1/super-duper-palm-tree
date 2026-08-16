const { parseAllFeeds } = require("../../../lib/parser");

module.exports = async function handler(req, res) {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  try {
    const result = await parseAllFeeds();
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("parse-feeds error:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
};
