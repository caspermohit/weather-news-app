import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Image, Button } from '@heroui/react';
import Loader from './Loader';
import './News.css'; // Optional: Create a separate CSS file for news styles

const News = () => {
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    setFilteredNews(response.data.articles.results);
                    setError(null);
                    setLoading(false);
                } else {
                    throw new Error('Unexpected API response structure');
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                setError("An error occurred while fetching news. Please try again later.");
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="fullscreen-loading">
                <div className="loading-content">
                    <Loader />
                    <br />
                    <p className="loading-text">Loading news...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className='news-section'>
            <h1 className="news-title">Top 12 News</h1>
            <div className='news-container'>
                {filteredNews.filter(article => article.image).map((article, index) => (
                    <Card key={index} className="news-article">
                        <Image 
                            src={article.image} 
                            alt={article.title}
                            className="news-image"
                        />
                        <div className="news-content">
                            <h3>{truncateText(article.title, 60)}</h3>
                            <p>{truncateText(article.description || article.body, 100)}</p>
                            <Button 
                                as="a" 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                variant="contained"
                                color="primary"
                            >
                                Read More
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default News;
