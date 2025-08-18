document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');
    const forecastInfo = document.getElementById('forecast-info');
    const unitBtns = document.querySelectorAll('.unit-btn');

    const apiKey = "a3837965ed61ce76b99b6e105dd058af"; 

    let weatherData = null; // Store current weather data
    let forecastData = null; // Store 5-day forecast data
    let currentUnit = 'fahrenheit'; 

    const fetchWeather = async (city) => {
        const urlCurrentFahrenheit = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const urlCurrentCelsius = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        const urlForecastFahrenheit = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
        const urlForecastCelsius = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const [currentF, currentC, forecastF, forecastC] = await Promise.all([
                fetch(urlCurrentFahrenheit),
                fetch(urlCurrentCelsius),
                fetch(urlForecastFahrenheit),
                fetch(urlForecastCelsius)
            ]);
            
            const dataCurrentF = await currentF.json();
            const dataCurrentC = await currentC.json();
            const dataForecastF = await forecastF.json();
            const dataForecastC = await forecastC.json();

            if (dataCurrentF.cod === "404") {
                weatherInfo.innerHTML = `<p class="placeholder">City not found. Please try again.</p>`;
                forecastInfo.innerHTML = '';
                return;
            }

            weatherData = {
                'fahrenheit': dataCurrentF,
                'celsius': dataCurrentC
            };

            forecastData = {
                'fahrenheit': dataForecastF,
                'celsius': dataForecastC
            };

            displayWeather(weatherData[currentUnit], currentUnit);
            displayForecast(forecastData[currentUnit], currentUnit);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = `<p class="placeholder">Failed to retrieve data. Please check your network connection.</p>`;
            forecastInfo.innerHTML = '';
        }
    };

    const displayWeather = (data, unit) => {
        const { name, main, weather, wind } = data;
        const iconCode = weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';
        const windUnit = unit === 'fahrenheit' ? 'mph' : 'm/s';
        
        weatherInfo.innerHTML = `
            <h2>${name}</h2>
            <img src="${iconUrl}" alt="${weather[0].description}">
            <p class="temp">${Math.round(main.temp)}${tempUnit}</p>
            <p class="description">${weather[0].description}</p>
            <p>Feels Like: ${Math.round(main.feels_like)}${tempUnit}</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${Math.round(wind.speed)} ${windUnit}</p>
        `;
    };

    const displayForecast = (data, unit) => {
        forecastInfo.innerHTML = '';
        const forecastList = data.list;
        const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';
        
        const dailyForecasts = {};
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = forecast;
            }
        });

        Object.values(dailyForecasts).slice(0, 5).forEach(day => {
            const iconCode = day.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <h4>${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</h4>
                <img src="${iconUrl}" alt="${day.weather[0].description}">
                <p>${Math.round(day.main.temp)}${tempUnit}</p>
                <p>${day.weather[0].description}</p>
            `;
            forecastInfo.appendChild(card);
        });
    };

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            weatherInfo.innerHTML = `<p class="placeholder">Please enter a city name.</p>`;
            forecastInfo.innerHTML = '';
        }
    });

    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click();
        }
    });

    unitBtns.forEach(button => {
        button.addEventListener('click', () => {
            unitBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentUnit = button.dataset.unit;
            
            if (weatherData && forecastData) {
                displayWeather(weatherData[currentUnit], currentUnit);
                displayForecast(forecastData[currentUnit], currentUnit);
            }
        });
    });
});