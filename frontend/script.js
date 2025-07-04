document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const feeds = [
        'https://www.prothomalo.com/feed/',
        'https://www.kalerkantho.com/rss.xml',
        'https://www.bbc.com/bengali/index.xml'
    ];

    const RSS_TO_JSON_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

    async function fetchNews() {
        newsContainer.innerHTML = ''; // Clear loading message
        for (const feedUrl of feeds) {
            try {
                const response = await fetch(RSS_TO_JSON_PROXY + encodeURIComponent(feedUrl));
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
                    errorDiv.textContent = `Failed to load news from ${feedUrl}: ${data.message}`;
                    newsContainer.appendChild(errorDiv);
                }
            } catch (error) {
                console.error('Error fetching or parsing feed:', error);
                const errorDiv = document.createElement('div');
                errorDiv.textContent = `Failed to load news from ${feedUrl}: ${error.message}`;
                newsContainer.appendChild(errorDiv);
            }
        }
    }

    fetchNews();
});