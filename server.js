const express = require("express");
const cors = require("cors");
const path = require("path");
const fetchRSS = require("./services/fetchRSS");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/feed", async (req, res) => {
  try {
    const data = await fetchRSS();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "RSS fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
