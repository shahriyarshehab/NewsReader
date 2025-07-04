require('dotenv').config();
const Parser = require("rss-parser");
const parser = new Parser();

const feeds = [
  process.env.PROTHOMALO_FEED,
  process.env.KALERKANTHO_FEED,
  process.env.BBC_FEED,
  process.env.ITTEFAQ_FEED
];

async function fetchRSS() {
  const allFeeds = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        source: feed.title,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date()
      }));
      allFeeds.push(...items);
    } catch (err) {
      console.error("❌ Error fetching feed:", url);
    }
  }

  // Sort by latest date first
  allFeeds.sort((a, b) => b.pubDate - a.pubDate);

  return allFeeds.map(item => ({
    ...item,
    pubDate: item.pubDate.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })
  }));
}

module.exports = fetchRSS;
