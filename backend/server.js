const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const parser = new Parser();

const app = express();
const PORT = process.env.PORT || 5000;

const feeds = {
  prothomalo: "https://www.prothomalo.com/feed/",
  kalerkantho: "https://www.kalerkantho.com/rss.xml",
  bbc: "https://www.bbc.com/bengali/index.xml"
};

app.use(cors());

app.get("/feed", async (req, res) => {
  const source = req.query.source;
  let urls = Object.values(feeds);

  if (source && feeds[source]) {
    urls = [feeds[source]];
  }

  try {
    let allItems = [];
    for (const url of urls) {
      const feed = await parser.parseURL(url);
      const items = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        source: feed.title,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date()
      }));
      allItems.push(...items);
    }

    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    allItems = allItems.map(item => ({
      ...item,
      pubDate: new Date(item.pubDate).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })
    }));

    res.json(allItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feeds." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ HeadlineHub backend running at http://localhost:${PORT}`);
});
