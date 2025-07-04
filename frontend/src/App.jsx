import React, { useEffect, useState } from "react";

const App = () => {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    let url = import.meta.env.VITE_APP_BACKEND_URL + "/feed";
    if (category !== "all") {
      url += "?source=" + category;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setNews(data));
  }, [category]);

  const filtered = news.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-4">📰 HeadlineHub</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search news..."
          className="border p-2 flex-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Sources</option>
          <option value="prothomalo">Prothom Alo</option>
          <option value="kalerkantho">Kaler Kantho</option>
          <option value="bbc">BBC Bangla</option>
        </select>
      </div>

      <ul className="space-y-3">
        {filtered.slice(0, visibleCount).map((item, index) => (
          <li key={index} className="bg-white p-4 rounded shadow">
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
              {item.title}
            </a>
            <div className="text-sm text-gray-500">
              {item.pubDate} | {item.source}
            </div>
          </li>
        ))}
      </ul>

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + 10)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default App;
