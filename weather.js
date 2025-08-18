document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');
    const unitBtns = document.querySelectorAll('.unit-btn');

    const apiKey = "a3837965ed61ce76b99b6e105dd058af";
    let weatherData = null; // Store the fetched data

    const fetchWeather = async (city) => {
        const urlFahrenheit = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const urlCelsius = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        try {
            const [responseF, responseC] = await Promise.all([
                fetch(urlFahrenheit),
                fetch(urlCelsius)
            ]);
            
            const dataF = await responseF.json();
            const dataC = await responseC.json();

            if (dataF.cod === "404") {
                weatherInfo.innerHTML = `<p class="placeholder">City not found. Please try again.</p>`;
                return;
            }

            weatherData = {
                fahrenheit: dataF,
                celsius: dataC
            };

            const activeUnit = document.querySelector('.unit-btn.active').dataset.unit;
            displayWeather(weatherData[activeUnit]);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = `<p class="placeholder">Failed to retrieve data. Please check your network connection.</p>`;
        }
    };

    const displayWeather = (data) => {
        const { name, main, weather, wind } = data;
        const iconCode = weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const unit = data.main.temp > 100 ? '°F' : '°C'; // Simple way to detect unit based on value
        
        weatherInfo.innerHTML = `
            <h2>${name}</h2>
            <img src="${iconUrl}" alt="${weather[0].description}">
            <p class="temp">${Math.round(main.temp)}${unit}</p>
            <p class="description">${weather[0].description}</p>
            <p>Feels Like: ${Math.round(main.feels_like)}${unit}</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${Math.round(wind.speed)} ${unit === '°F' ? 'mph' : 'm/s'}</p>
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
            if (weatherData) {
                unitBtns.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const unit = button.dataset.unit;
                displayWeather(weatherData[unit]);
            }
        });
    });
});