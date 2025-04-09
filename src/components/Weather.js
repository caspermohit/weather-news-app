import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { Card, Button, Input } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faTemperatureHigh, faTint, faWind, faLocationArrow, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
import './Weather.css'; // Import the CSS file

// Create a lazy-loaded component for nearby locations
const NearbyLocations = lazy(() => import('./NearbyLocations'));

function Weather() {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [nearbyWeatherData, setNearbyWeatherData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [minimumLoadingTime, setMinimumLoadingTime] = useState(true);

    useEffect(() => {
        // Set a minimum loading time of 2 seconds
        const timer = setTimeout(() => {
            setMinimumLoadingTime(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const fetchNearbyLocations = useCallback(async (lat, lon) => {
        const apiKey = 'dd446acc0bc623ca709d10d53266b44c'; // Replace with your OpenWeather API key
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=6&appid=${apiKey}`); // Fetch 6 locations
            const locations = response.data.list;
            const weatherPromises = locations.map(location => fetchWeatherForLocation(location.id));
            const weatherResults = await Promise.all(weatherPromises);
            setNearbyWeatherData(weatherResults.filter(result => result !== null)); // Filter out null results
        } catch (error) {
            console.error("Error fetching nearby locations:", error);
            setError("Failed to fetch nearby locations");
        }
    }, []); // No dependencies needed since fetchWeatherForLocation is defined below

    const fetchWeatherForLocation = async (locationId) => {
        const apiKey = 'dd446acc0bc623ca709d10d53266b44c'; // Replace with your OpenWeather API key
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${locationId}&appid=${apiKey}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching weather for location:", error);
            return null; // Return null if there's an error
        }
    };

    const fetchWeatherData = async (position) => {
        setLoading(true);
        setError(null);
        const { latitude, longitude } = position.coords;
        const apiKey = 'dd446acc0bc623ca709d10d53266b44c';
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
            setCurrentWeather(response.data);
            setSearchQuery(response.data.name);
            await fetchNearbyLocations(latitude, longitude);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("Failed to fetch weather data. Please try searching for a city manually.");
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your location. Please search for a city manually.";
        
        if (error.code === 1) {
            errorMessage = "Location access was denied. Please enable location access in your browser settings or search for a city manually.";
        } else if (error.code === 2) {
            errorMessage = "Location is unavailable. Please check your internet connection or search for a city manually.";
        } else if (error.code === 3) {
            errorMessage = "Location request timed out. Please try again or search for a city manually.";
        }
        
        setLocationError(errorMessage);
        setLoading(false);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            setLocationError(null);
            navigator.geolocation.getCurrentPosition(
                fetchWeatherData,
                handleError,
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser. Please search for a city manually.");
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        const apiKey = 'dd446acc0bc623ca709d10d53266b44c';
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`);
            setCurrentWeather(response.data);
            setLocationError(null);
            await fetchNearbyLocations(response.data.coord.lat, response.data.coord.lon);
        } catch (error) {
            console.error("Error fetching weather data for search query:", error);
            setError("Location not found. Please try another city.");
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (iconCode) => {
        // Map OpenWeatherMap icon codes to our SVG icons
        const iconMap = {
            // Clear sky
            '01d': 'clear-day.svg',
            '01n': 'clear-night.svg',
            
            // Partly cloudy
            '02d': 'partly-cloudy-day.svg',
            '02n': 'partly-cloudy-night.svg',
            
            // Cloudy
            '03d': 'cloudy.svg',
            '03n': 'cloudy.svg',
            
            // Overcast
            '04d': 'overcast-day.svg',
            '04n': 'overcast-night.svg',
            
            // Rain variations
            '09d': 'drizzle.svg',
            '09n': 'drizzle.svg',
            '10d': 'rain.svg',
            '10n': 'rain.svg',
            'partly-cloudy-day-rain': 'partly-cloudy-day-rain.svg',
            'partly-cloudy-night-rain': 'partly-cloudy-night-rain.svg',
            'raindrops': 'raindrops.svg',
            'raindrop': 'raindrop.svg',
            'umbrella': 'umbrella.svg',
            
            // Thunderstorm variations
            '11d': 'thunderstorms-day.svg',
            '11n': 'thunderstorms-night.svg',
            'thunderstorms-rain': 'thunderstorms-rain.svg',
            'thunderstorms-snow': 'thunderstorms-snow.svg',
            'thunderstorms-day-rain': 'thunderstorms-day-rain.svg',
            'thunderstorms-night-rain': 'thunderstorms-night-rain.svg',
            'thunderstorms-day-snow': 'thunderstorms-day-snow.svg',
            'thunderstorms-night-snow': 'thunderstorms-night-snow.svg',
            'lightning-bolt': 'lightning-bolt.svg',
            
            // Snow variations
            '13d': 'snow.svg',
            '13n': 'snow.svg',
            'partly-cloudy-day-snow': 'partly-cloudy-day-snow.svg',
            'partly-cloudy-night-snow': 'partly-cloudy-night-snow.svg',
            'snowflake': 'snowflake.svg',
            
            // Fog/Mist variations
            '50d': 'fog-day.svg',
            '50n': 'fog-night.svg',
            'fog': 'fog.svg',
            'mist': 'mist.svg',
            'partly-cloudy-day-fog': 'partly-cloudy-day-fog.svg',
            'partly-cloudy-night-fog': 'partly-cloudy-night-fog.svg',
            
            // Dust variations
            'dust': 'dust.svg',
            'dust-day': 'dust-day.svg',
            'dust-night': 'dust-night.svg',
            'dust-wind': 'dust-wind.svg',
            
            // Haze variations
            'haze': 'haze.svg',
            'haze-day': 'haze-day.svg',
            'haze-night': 'haze-night.svg',
            
            // Sleet
            'sleet': 'sleet.svg',
            'partly-cloudy-day-sleet': 'partly-cloudy-day-sleet.svg',
            'partly-cloudy-night-sleet': 'partly-cloudy-night-sleet.svg',
            
            // Smoke variations
            'smoke': 'smoke.svg',
            'smoke-particles': 'smoke-particles.svg',
            'partly-cloudy-day-smoke': 'partly-cloudy-day-smoke.svg',
            'partly-cloudy-night-smoke': 'partly-cloudy-night-smoke.svg',
            
            // Special conditions
            'tornado': 'tornado.svg',
            'hurricane': 'hurricane.svg',
            'solar-eclipse': 'solar-eclipse.svg',
            'starry-night': 'starry-night.svg',
            'falling-stars': 'falling-stars.svg',
            
            // Moon phases
            'moon-new': 'moon-new.svg',
            'moon-first-quarter': 'moon-first-quarter.svg',
            'moon-full': 'moon-full.svg',
            'moon-last-quarter': 'moon-last-quarter.svg',
            'moon-waxing-crescent': 'moon-waxing-crescent.svg',
            'moon-waxing-gibbous': 'moon-waxing-gibbous.svg',
            'moon-waning-crescent': 'moon-waning-crescent.svg',
            'moon-waning-gibbous': 'moon-waning-gibbous.svg',
            
            // Sunrise/Sunset
            'sunrise': 'sunrise.svg',
            'sunset': 'sunset.svg',
            'moonrise': 'moonrise.svg',
            'moonset': 'moonset.svg',
            
            // Temperature indicators
            'thermometer': 'thermometer.svg',
            'thermometer-celsius': 'thermometer-celsius.svg',
            'thermometer-fahrenheit': 'thermometer-fahrenheit.svg',
            'thermometer-glass': 'thermometer-glass.svg',
            'thermometer-glass-celsius': 'thermometer-glass-celsius.svg',
            'thermometer-glass-fahrenheit': 'thermometer-glass-fahrenheit.svg',
            'thermometer-warmer': 'thermometer-warmer.svg',
            'thermometer-colder': 'thermometer-colder.svg',
            
            // Pressure indicators
            'pressure-high': 'pressure-high.svg',
            'pressure-low': 'pressure-low.svg',
            'pressure-high-alt': 'pressure-high-alt.svg',
            'pressure-low-alt': 'pressure-low-alt.svg',
            
            // UV Index
            'uv-index-1': 'uv-index-1.svg',
            'uv-index-2': 'uv-index-2.svg',
            'uv-index-10': 'uv-index-10.svg',
            'uv-index-11': 'uv-index-11.svg',
            
            // Wind and direction
            'wind': 'wind.svg',
            'compass': 'compass.svg',
            'horizon': 'horizon.svg'
        };

        const iconName = iconMap[iconCode] || 'not-available.svg';
        return `/assets/weather-icons/${iconName}`;
    };

    const getWeatherAdvice = useCallback(() => {
        if (!currentWeather) return '';
        const tempCelsius = Math.round(currentWeather.main.temp - 273.15); // Convert from Kelvin to Celsius
        const weatherDescription = currentWeather.weather[0].description.toLowerCase();

        let advice = '';
        if (tempCelsius < 12) {
            advice += 'You might want to wear a jacket. ';
        }
        if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle')) {
            advice += 'Don\'t forget your umbrella!';
        }
        
        return advice;
    }, [currentWeather]); // Add currentWeather as a dependency

    const sendWeatherNotification = useCallback((weather, advice) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification('Weather Update', {
                body: `Current weather: ${weather.weather[0].description}, Temp: ${Math.round(weather.main.temp - 273.15)}°C. ${advice}`,
                icon: getWeatherIcon(weather.weather[0].icon)
            });

            notification.onclick = () => {
                window.focus();
            };
        }
    }, []); // No dependencies needed

    useEffect(() => {
        // Request permission for notifications
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (currentWeather) {
            const advice = getWeatherAdvice();
            sendWeatherNotification(currentWeather, advice);
        }
    }, [currentWeather, getWeatherAdvice, sendWeatherNotification]); // Include getWeatherAdvice and sendWeatherNotification

    if (loading || minimumLoadingTime) {
        return (
            <div className="fullscreen-loading">
                <div className="loading-content">
                    <Loader />
                    <br />
                    <p className="loading-text">Loading weather data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="weather-container">
            <Card className="search-card glass-effect">
                <form onSubmit={handleSearch}>
                    <div className="search-input-container">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a city..."
                            fullWidth
                            className="search-input"
                        />
                        <div className="button-group">
                            <Button 
                                type="button"
                                variant="contained" 
                                color="primary"
                                className="location-button"
                                onClick={getCurrentLocation}
                                disabled={loading}
                                title="Get weather for your current location"
                            >
                                <FontAwesomeIcon icon={faLocationArrow} className="location-icon" />
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                className="search-button"
                                disabled={loading}
                            >
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            {locationError && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
                    {locationError}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {currentWeather && (
                <div className="weather-card glass-effect">
                    <div className="weather-icon-container">
                        <img 
                            src={getWeatherIcon(currentWeather.weather[0].icon)} 
                            alt={currentWeather.weather[0].description}
                            className="weather-icon"
                            loading="lazy"
                        />
                    </div>

                    <div className="card-header">
                        <span className="location-name">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                            {currentWeather.name}, {currentWeather.sys.country}
                        </span>
                        <span className="current-date">{new Date().toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>

                    <div className="weather-details">
                        <span className="weather-description">{currentWeather.weather[0].description}</span>
                        <div className="additional-info">
                            <div className="info-item">
                                <FontAwesomeIcon icon={faTemperatureHigh} className="info-icon" />
                                <span>Feels like: {Math.round(currentWeather.main.feels_like - 273.15)}°C</span>
                            </div>
                            <div className="info-item">
                                <FontAwesomeIcon icon={faTint} className="info-icon" />
                                <span>Humidity: {currentWeather.main.humidity}%</span>
                            </div>
                            <div className="info-item">
                                <FontAwesomeIcon icon={faWind} className="info-icon" />
                                <span>Wind: {currentWeather.wind.speed} m/s</span>
                            </div>
                        </div>
                    </div>

                    <div className="temperature-container">
                        <span className="temp">{Math.round(currentWeather.main.temp - 273.15)}°</span>
                        <div className="temp-scale">
                            <span>Celcius</span>
                        </div>
                    </div>

                    {getWeatherAdvice() && (
                        <div className="weather-advice">
                            <i className="fas fa-info-circle"></i>
                            <span>{getWeatherAdvice()}</span>
                        </div>
                    )}
                </div>
            )}

            <Suspense fallback={<div className="loading-placeholder">Loading nearby locations...</div>}>
                <NearbyLocations 
                    nearbyWeatherData={nearbyWeatherData}
                    getWeatherIcon={getWeatherIcon}
                />
            </Suspense>
        </div>
    );
}

export default Weather;
