import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, } from 'react-router-dom'; // Change Switch to Routes
import './App.css'; // Import the CSS file
import Weather from './components/Weather'; // Import the Weather component
import News from './components/news'; // Import the News component
import Footer from './components/Footer'; // Import the Footer component

function App() {
  const [activeTab, setActiveTab] = useState('weather');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
  };

  const getTimeIcon = (hours) => {
    // Map hours to appropriate time-based icons
    if (hours >= 5 && hours < 12) {
        return '/assets/weather-icons/sunrise.svg'; // Morning
    } else if (hours >= 12 && hours < 17) {
        return '/assets/weather-icons/clear-day.svg'; // Afternoon
    } else if (hours >= 17 && hours < 20) {
        return '/assets/weather-icons/sunset.svg'; // Evening
    } else if (hours >= 20 || hours < 5) {
        return '/assets/weather-icons/clear-night.svg'; // Night
    }
  };

  const getMoonPhase = (date) => {
    // Simple moon phase calculation based on date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // This is a simplified calculation
    const phase = ((year * 12 + month) * 29.53 + day) % 29.53;
    
    if (phase < 1.85) return 'moon-new.svg';
    if (phase < 5.55) return 'moon-waxing-crescent.svg';
    if (phase < 9.25) return 'moon-first-quarter.svg';
    if (phase < 12.95) return 'moon-waxing-gibbous.svg';
    if (phase < 16.65) return 'moon-full.svg';
    if (phase < 20.35) return 'moon-waning-gibbous.svg';
    if (phase < 24.05) return 'moon-last-quarter.svg';
    return 'moon-waning-crescent.svg';
  };

  return (
    <Router>
      <div className="app-container">
        <div className="time-card glass-effect">
          <div className="time-content">
            <div className="time-display">
              <span className="time">{formatTime(currentTime)}</span>
            </div>
            <div className="day-text">{formatDate(currentTime)}</div>
          </div>
          <div className="time-icon">
            {currentTime.getHours() >= 20 || currentTime.getHours() < 5 ? (
              <img 
                src={`/assets/weather-icons/${getMoonPhase(currentTime)}`} 
                alt="Moon Phase" 
                className="moon-icon"
              />
            ) : (
              <img 
                src={getTimeIcon(currentTime.getHours())} 
                alt="Time of Day" 
                className="time-svg-icon"
              />
            )}
          </div>
        </div>

        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            Weather
          </button>
          <button 
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
        </div>

        <div className="content-container">
          {activeTab === 'weather' ? <Weather /> : <News />}
        </div>
      </div>
      <div>
        <Footer /> {/* News component without specific class */}
      </div>
    </Router>
  );
}

export default App;
