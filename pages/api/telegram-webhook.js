const { handleUpdate } = require("../../lib/bot");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") {
      await handleUpdate(req.body);
    }
  } catch (err) {
    console.error("telegram webhook error:", err);
  }
  res.status(200).json({ ok: true });
};
