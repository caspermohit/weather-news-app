import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Weather.css'; // Import the CSS file

function Weather() {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [nearbyWeatherData, setNearbyWeatherData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    useEffect(() => {
        const fetchWeatherData = async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = 'dd446acc0bc623ca709d10d53266b44c'; // Replace with your OpenWeather API key
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                setCurrentWeather(response.data);
                setSearchQuery(response.data.name); // Pre-fill search bar with current location
                await fetchNearbyLocations(latitude, longitude);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        const handleError = (error) => {
            console.error("Error getting location:", error);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeatherData, handleError);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, [fetchNearbyLocations]); // Include fetchNearbyLocations in the dependency array

    const handleSearch = async (event) => {
        event.preventDefault();
        const apiKey = 'dd446acc0bc623ca709d10d53266b44c'; // Replace with your OpenWeather API key
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`);
            setCurrentWeather(response.data);
            // Fetch nearby locations for the searched city
            await fetchNearbyLocations(response.data.coord.lat, response.data.coord.lon);
        } catch (error) {
            console.error("Error fetching weather data for search query:", error);
        }
    };

    const getWeatherIcon = (iconCode) => {
        return `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL for the weather icon
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

    return (
        <div className="weather-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a city..."
                />
                <button type="submit">Search</button> {/* Search button */}
            </form>
            {currentWeather && (
                <div className="current-weather">
                    <h2>Current Weather:</h2>
                    <p>
                        <img src={getWeatherIcon(currentWeather.weather[0].icon)} alt={currentWeather.weather[0].description} />
                        {currentWeather.name}, {currentWeather.sys.country}: {currentWeather.weather[0].description}, Temp: {Math.round(currentWeather.main.temp - 273.15)}°C,
                        feels like: {Math.round(currentWeather.main.feels_like - 273.15)}°C
                        ({getWeatherAdvice()})
                    </p>
                </div>
            )}
            <div className="nearby-locations">
                <h3>Nearby Locations Weather:</h3>
                <ul className="nearby-locations-list">
                    {nearbyWeatherData.map((location) => (
                        location ? (
                            <li key={location.id} className="nearby-location-item">
                                <img src={getWeatherIcon(location.weather[0].icon)} alt={location.weather[0].description} />
                                {location.name}, {location.sys.country}: {location.weather[0].description}, Temp: {Math.round(location.main.temp - 273.15)}°C
                                ,feels like: {Math.round(currentWeather.main.feels_like - 273.15)}°C
                            </li>
                        ) : null
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Weather;
