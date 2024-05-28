import { useEffect, useState } from "react";
import axios from 'axios';
import './weather.css'

const API_KEY = "c6dea39f86ea31dc114f0a4f0eec8fa9";

interface WeatherData {
    name: string;
    main: {
        temp: number
    };
    weather: {
        description: string
        icon: string;
    }[]
}

type AppError = Error | GeolocationPositionError

export const Weather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<AppError | null>(null)
    const [position, setPosition] = useState<{ latitude: number, longitude: number } | null>(null)
    
    const CACHE_DURATION = 600000;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                },
                (err) => {
                    setError(err)
                    setLoading(false)
                }
            )
        } else {
            setError(new Error('Geolocation is not supported by this browser'))
        }
    }, [])

    useEffect(() => {
        if (position) {
            const getWeather = async () => {

                const cacheKey = `weather_${position.latitude}_${position.longitude}`
                const cachedData = localStorage.getItem(cacheKey)
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData)
                    const cacheTime = parsedData.timestamp
                    const now = new Date().getTime();
                    if (now - cacheTime < CACHE_DURATION) {
                        setWeather(parsedData.weather)
                        setLoading(false)
                        return
                    }
                }

                try {
                    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                        params: {
                            lat: position.latitude,
                            lon: position.longitude,
                            appid: API_KEY,
                            units: 'metric',
                        }
                    });

                    const weatherData: WeatherData = response.data;
                    setWeather(weatherData);
                    localStorage.setItem(cacheKey, JSON.stringify({
                        weather: weatherData,
                        timestamp: new Date().getTime()
                    }));
                } catch (err: any) {
                    setError(err)
                } finally {
                    setLoading(false)
                }
            };
            
            getWeather();
        }
        
    }, [position]);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error.message}</p>
    }

    return (
        <div className="weather__container">
            {
                weather ? (
                    <>
                        <h1>Météo à {weather.name}</h1>
                        <p>Température: {weather.main.temp}°C</p>
                        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} className="weather__img"/>
                    </>
                ) : (
                    <p>no weather data available</p>
                )
            }
        </div>
    );
};
