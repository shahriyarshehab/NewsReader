document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const themeToggle = document.getElementById('theme-toggle');
    const categorySelect = document.getElementById('category');

    const feeds = [
        { name: 'prothomalo', url: 'https://www.prothomalo.com/feed/' },
        { name: 'kalerkantho', url: 'https://www.kalerkantho.com/rss.xml' },
        { name: 'bbc', url: 'https://www.bbc.com/bengali/index.xml' }
    ];

    const RSS_TO_JSON_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

    // Theme toggle logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light-theme';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark-theme';
        }
        localStorage.setItem('theme', theme);
    });

    // Category selection logic
    categorySelect.addEventListener('change', fetchNews);

    async function fetchNews() {
        newsContainer.innerHTML = ''; // Clear loading message
        const selectedCategory = categorySelect.value;

        const feedsToFetch = selectedCategory === 'all'
            ? feeds
            : feeds.filter(feed => feed.name === selectedCategory);

        for (const feed of feedsToFetch) {
            try {
                const response = await fetch(RSS_TO_JSON_PROXY + encodeURIComponent(feed.url));
                const data = await response.json();

                if (data.status === 'ok') {
                    data.items.forEach(item => {
                        const newsItem = document.createElement('div');
                        newsItem.classList.add('news-item');

                        const title = document.createElement('h2');
                        const link = document.createElement('a');
                        link.href = item.link;
                        link.target = '_blank';
                        link.textContent = item.title;
                        title.appendChild(link);

                        const pubDate = document.createElement('p');
                        pubDate.textContent = `Published: ${new Date(item.pubDate).toLocaleString()}`;

                        const description = document.createElement('p');
                        description.innerHTML = item.description;

                        newsItem.appendChild(title);
                        newsItem.appendChild(pubDate);
                        newsItem.appendChild(description);

                        newsContainer.appendChild(newsItem);
                    });
                } else {
                    console.error('Error fetching feed:', data.message);
                    const errorDiv = document.createElement('div');
                    errorDiv.textContent = `Failed to load news from ${feed.url}: ${data.message}`;
                    newsContainer.appendChild(errorDiv);
                }
            } catch (error) {
                console.error('Error fetching or parsing feed:', error);
                const errorDiv = document.createElement('div');
                errorDiv.textContent = `Failed to load news from ${feed.url}: ${error.message}`;
                newsContainer.appendChild(errorDiv);
            }
        }
    }

    fetchNews();
});