document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');
    const unitBtns = document.querySelectorAll('.unit-btn');

    // Replace with your actual API key
    const apiKey = "YOUR_API_KEY"; 

    let weatherData = null; 

    const fetchWeather = async (city) => {
        const activeUnit = document.querySelector('.unit-btn.active').dataset.unit;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${activeUnit === 'fahrenheit' ? 'imperial' : 'metric'}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === "404") {
                weatherInfo.innerHTML = `<p class="placeholder">City not found. Please try again.</p>`;
                return;
            }

            weatherData = data;
            displayWeather(weatherData, activeUnit);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = `<p class="placeholder">Failed to retrieve data. Please check your network connection.</p>`;
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

    unitBtns.forEach(button => {
        button.addEventListener('click', () => {
            unitBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (weatherData) {
                const city = cityInput.value.trim();
                fetchWeather(city);
            }
        });
    });
});