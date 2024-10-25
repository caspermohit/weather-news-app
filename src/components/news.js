import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Optional: Create a separate CSS file for news styles

const News = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=e9b76bb82ba84804b04059aa1254e50b');
                setNews(response.data.articles);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className='news-section'>
            <h1 className="news-title">Top 12 News</h1>
            <div className='news-container'>
                {news.filter(article => article.urlToImage).slice(0, 12).map((article, index) => (
                    <div key={index} className="news-article">
                        <img src={article.urlToImage} alt={article.title} />
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
