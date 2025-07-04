require('dotenv').config();
const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const parser = new Parser();

const app = express();
const PORT = process.env.PORT || 5000;

const feeds = {
  prothomalo: process.env.PROTHOMALO_FEED,
  kalerkantho: process.env.KALERKANTHO_FEED,
  bbc: process.env.BBC_FEED
};

app.use(cors());

app.get("/feed", async (req, res) => {
  const source = req.query.source;
  const custom = req.query.custom;
  let urls = [];

  if (custom) {
    urls = [custom];
  } else if (source && feeds[source]) {
    urls = [feeds[source]];
  } else {
    urls = Object.values(feeds);
  }

  try {
    let allItems = [];
    for (const url of urls) {
      const feed = await parser.parseURL(url);
      const items = feed.items.map(item => {
        const image =
          item.enclosure?.url ||
          (item.content && item.content.match(/<img.+?src=["'](.+?)["']/)?.[1]) ||
          null;

        return {
          title: item.title,
          link: item.link,
          source: feed.title,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          image: image
        };
      });
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
