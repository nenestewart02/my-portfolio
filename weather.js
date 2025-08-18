document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');
    const unitBtns = document.querySelectorAll('.unit-btn');

    const apiKey = "a3837965ed61ce76b99b6e105dd058af"; 

    let weatherData = null; // Store both Fahrenheit and Celsius data
    let currentUnit = 'fahrenheit'; // The current active unit

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
                'fahrenheit': dataF,
                'celsius': dataC
            };

            displayWeather(weatherData[currentUnit], currentUnit);

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
            currentUnit = button.dataset.unit;
            
            if (weatherData) {
                displayWeather(weatherData[currentUnit], currentUnit);
            }
        });
    });
});