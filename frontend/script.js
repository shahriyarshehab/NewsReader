document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = mobileMenu.querySelectorAll('a');
    const newspaperMenu = document.getElementById('newspaper-menu');
    const successPopupOverlay = document.getElementById('success-popup-overlay');
    const popupCloseButton = document.getElementById('popup-close-button');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.remove('-translate-x-full');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.add('-translate-x-full');
    });

    popupCloseButton.addEventListener('click', () => {
        successPopupOverlay.classList.remove('show');
    });

    let feeds = [];

    async function loadFeeds() {
        try {
            const response = await fetch('newspapers.json');
            feeds = await response.json();
            renderNewspaperMenu();
            fetchNews();
        } catch (error) {
            console.error('Error loading feeds from NewspapersRSS:', error);
            // Fallback or error handling if feeds cannot be loaded
        }
    }

    loadFeeds();

    let currentCategory = 'local'; // Default category
    let currentNewspaper = null; // State variable for selected newspaper

    // Function to render newspaper menu
    function renderNewspaperMenu() {
        newspaperMenu.innerHTML = ''; // Clear existing buttons
        const feedsToDisplay = feeds.filter(feed => feed.category === currentCategory);

        feedsToDisplay.forEach(feed => {
            // Only render buttons for actual news feeds
            if (feed.category !== 'info') {
                const button = document.createElement('button');
                button.classList.add('px-3', 'py-2', 'rounded-md', 'text-sm', 'font-medium', 'text-white', 'bg-blue-600', 'hover:bg-blue-800', 'dark:bg-gray-600', 'dark:hover:bg-gray-900', 'mr-2', 'whitespace-nowrap');
                button.textContent = feed.name;
                button.dataset.newspaper = feed.name; // Store newspaper name
                button.addEventListener('click', () => {
                    currentNewspaper = feed.name;
                    fetchNews();
                });
                newspaperMenu.appendChild(button);
            }
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Always prevent default for menu links
            currentCategory = e.currentTarget.dataset.category;
            currentNewspaper = null; // Reset selected newspaper when category changes
            mobileMenu.classList.add('-translate-x-full');
            
            // Only render newspaper menu if not in 'info' category
            if (currentCategory !== 'info') {
                renderNewspaperMenu(); 
            } else {
                newspaperMenu.innerHTML = ''; // Clear newspaper menu for 'info' category
            }
            fetchNews();
        });
    });

    function createNewsCard(item) {
        const newsItem = document.createElement('div');
        newsItem.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'p-4', 'flex', 'items-start', 'space-x-4', 'dark:bg-gray-700', 'dark:text-gray-100');

        if (item.thumbnail && item.thumbnail.length > 0) {
            const image = document.createElement('img');
            image.src = item.thumbnail;
            image.alt = item.title;
            image.classList.add('w-24', 'h-24', 'object-cover', 'rounded-md');
            newsItem.appendChild(image);
        }

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex-1');

        const newspaperName = document.createElement('p');
        newspaperName.textContent = item.feedName;
        newspaperName.classList.add('text-sm', 'font-semibold', 'text-gray-600', 'mb-1', 'dark:text-gray-300');
        contentWrapper.appendChild(newspaperName);

        const title = document.createElement('h2');
        title.classList.add('text-lg', 'font-semibold', 'mb-1', 'text-blue-600');
        const link = document.createElement('a');
        link.classList.add('hover:underline', 'news-title-link');
        link.textContent = item.title;
        link.href = item.link;
        link.target = '_blank';
        title.appendChild(link);
        contentWrapper.appendChild(title);

        const pubDate = document.createElement('p');
        pubDate.classList.add('text-xs', 'text-gray-500', 'mb-1');
        pubDate.textContent = `Published: ${new Date(item.pubDate).toLocaleString()}`;
        contentWrapper.appendChild(pubDate);

        const description = document.createElement('p');
        description.classList.add('text-sm', 'text-gray-700', 'dark:text-gray-300');
        description.innerHTML = (item.description || item.content || '').substring(0, 200) + '...';
        contentWrapper.appendChild(description);

        const readMoreButton = document.createElement('a');
        readMoreButton.classList.add('mt-2', 'inline-block', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'py-1', 'px-3', 'rounded-md', 'text-sm', 'transition-colors', 'duration-300', 'mx-auto', 'md:ml-auto', 'md:mr-0');
        readMoreButton.href = item.link;
        readMoreButton.target = '_blank';
        readMoreButton.textContent = 'Read Full Article';
        contentWrapper.appendChild(readMoreButton);

        newsItem.appendChild(contentWrapper);
        return newsItem;
    }

    async function fetchNews() {
        newsContainer.innerHTML = '<div class="loader"></div>'; // Show spinner

        if (currentCategory === 'info') {
            try {
                const response = await fetch('about_content.html');
                const data = await response.text();
                newsContainer.innerHTML = data;
                newspaperMenu.innerHTML = ''; // Clear newspaper menu for 'info' category

                // Add event listener for the feedback form after content is loaded
                setTimeout(() => {
                    const feedbackForm = document.getElementById('feedback-form');
                    const openFeedbackPopupButton = document.getElementById('open-feedback-popup');
                    const feedbackPopupOverlay = document.getElementById('feedback-popup-overlay');
                    const feedbackPopupBackButton = document.getElementById('feedback-popup-back-button');

                    console.log('Feedback Form Element:', feedbackForm);
                    console.log('Open Feedback Button Element:', openFeedbackPopupButton);
                    console.log('Feedback Popup Overlay Element:', feedbackPopupOverlay);
                    console.log('Feedback Popup Back Button Element:', feedbackPopupBackButton);

                    if (feedbackForm) {
                        feedbackForm.addEventListener('submit', async (e) => {
                            e.preventDefault();
                            console.log('Feedback form submitted!');
                            const formData = new FormData(feedbackForm);
                            try {
                                const response = await fetch(feedbackForm.action, {
                                    method: feedbackForm.method,
                                    body: formData,
                                    headers: {
                                        'Accept': 'application/json'
                                    }
                                });
                                if (response.ok) {
                                    feedbackPopupOverlay.classList.remove('show'); // Hide feedback popup
                                    successPopupOverlay.classList.add('show');
                                    setTimeout(() => {
                                        successPopupOverlay.classList.remove('show');
                                    }, 3000); // Hide after 3 seconds
                                    feedbackForm.reset();
                                    console.log('Feedback submitted successfully!');
                                } else {
                                    console.error('Form submission failed:', response.statusText);
                                    alert('Failed to send feedback. Please try again.');
                                }
                            } catch (error) {
                                console.error('Error submitting form:', error);
                                alert('An error occurred. Please try again.');
                            }
                        });
                        console.log('Feedback form listener attached.');
                    }

                    if (openFeedbackPopupButton) {
                        openFeedbackPopupButton.addEventListener('click', () => {
                            feedbackPopupOverlay.classList.add('show');
                            console.log('Open feedback button clicked!');
                        });
                        console.log('Open feedback button listener attached.');
                    }

                    if (feedbackPopupBackButton) {
                        feedbackPopupBackButton.addEventListener('click', () => {
                            feedbackPopupOverlay.classList.remove('show');
                            console.log('Feedback back button clicked!');
                        });
                        console.log('Feedback back button listener attached.');
                    }

                }, 0); // Use setTimeout to ensure DOM is updated

            } catch (error) {
                console.error('Error fetching about content:', error);
                newsContainer.innerHTML = '<p>Error loading about information.</p>';
            }
            return;
        }

        let allNewsItems = [];
        let feedsToFetch = feeds.filter(feed => {
            const categoryMatch = feed.category === currentCategory;
            const newspaperMatch = currentNewspaper ? feed.name === currentNewspaper : true;
            return categoryMatch && newspaperMatch;
        });

        // If no specific newspaper is selected, fetch all from the current category
        if (!currentNewspaper && feedsToFetch.length === 0) {
            feedsToFetch = feeds.filter(feed => feed.category === currentCategory);
        }

        if (feedsToFetch.length === 0) {
            newsContainer.innerHTML = `<p>No news available for ${currentCategory} category.</p>`;
            return;
        }

        for (const feed of feedsToFetch) {
            try {
                const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed.url));
                const data = await response.json();

                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        allNewsItems.push({
                            ...item,
                            feedName: feed.name,
                            feedImg: feed.img
                        });
                    });
                } else {
                    console.error(`No items found for ${feed.name} or API error: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error(`Error fetching or parsing feed from ${feed.name}:`, error);
            }
        }

        allNewsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        if (allNewsItems.length > 0) {
            newsContainer.innerHTML = ''; // Clear the spinner
            allNewsItems.forEach(item => {
                newsContainer.appendChild(createNewsCard(item));
            });
        } else {
            newsContainer.innerHTML = '<p>No news loaded. Please check feed URLs or network connection.</p>';
        }
    }

    loadFeeds();
});