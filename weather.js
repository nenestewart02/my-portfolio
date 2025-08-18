document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');
    
    // Replace with your actual API key
    const apiKey = "a3837965ed61ce76b99b6e105dd058af"; 

    const fetchWeather = async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === "404") {
                weatherInfo.innerHTML = `<p class="placeholder">City not found. Please try again.</p>`;
                return;
            }

            displayWeather(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = `<p class="placeholder">Failed to retrieve data. Please check your network connection.</p>`;
        }
    };

    const displayWeather = (data) => {
        const { name, main, weather, wind } = data;
        const iconCode = weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherInfo.innerHTML = `
            <h2>${name}</h2>
            <img src="${iconUrl}" alt="${weather[0].description}">
            <p class="temp">${Math.round(main.temp)}°C</p>
            <p class="description">${weather[0].description}</p>
            <p>Feels Like: ${Math.round(main.feels_like)}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${Math.round(wind.speed * 3.6)} km/h</p>
        `;
    };

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            weatherInfo.innerHTML = `<p class="placeholder">Please enter a city name.</p>`;
        }
    });

    cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click();
        }
    });
});