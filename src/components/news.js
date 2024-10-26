import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Optional: Create a separate CSS file for news styles

const News = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            const options = {
                method: 'POST',
                url: 'https://eventregistry.org/api/v1/article/getArticles',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    apiKey: 'db02c44d-45b2-496d-9f27-655c6fb1eda1',
                    lang: "eng",
                    country: "US",
                    sortBy: "date",
                    sortByAsc: false,
                    articlesPage: 1,
                    articlesCount: 12
                }
            };

            try {
                const response = await axios.request(options);
                if (response.data && response.data.articles && response.data.articles.results) {
                    setNews(response.data.articles.results);
                    setError(null);
                } else {
                    throw new Error('Unexpected API response structure');
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                setError("An error occurred while fetching news. Please try again later.");
            }
        };
        fetchNews();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className='news-section'>
            <h1 className="news-title">Top 12 News</h1>
            <div className='news-container'>
                {news.filter(article => article.image).map((article, index) => (
                    <div key={index} className="news-article">
                        <img src={article.image} alt={article.title} />
                        <h3>{truncateText(article.title, 60)}</h3>
                        <p>{truncateText(article.description || article.body, 100)}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
