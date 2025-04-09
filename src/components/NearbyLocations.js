import React from 'react';

function NearbyLocations({ nearbyWeatherData, getWeatherIcon }) {
    return (
        <div className="nearby-locations glass-effect">
            <h3>Nearby Locations</h3>
            <div className="nearby-locations-list">
                {nearbyWeatherData.map((location) => (
                    location ? (
                        <div key={location.id} className="nearby-location-item glass-effect">
                            <img 
                                src={getWeatherIcon(location.weather[0].icon)} 
                                alt={location.weather[0].description} 
                                className="location-weather-icon"
                                loading="lazy"
                            />
                            <div className="location-details">
                                <p className="location-name">
                                    {location.name}, {location.sys.country}
                                </p>
                                <p className="location-weather">
                                    {location.weather[0].description}, {Math.round(location.main.temp - 273.15)}°C
                                </p>
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    );
}

export default NearbyLocations; 