document.addEventListener('DOMContentLoaded', () => {
    const accuWeatherApiKey = 'xgI6Gl1SYq5omyeX3tldswrQZhAbBVbJ'; //AccuWeather API key

    // Auto detect user's current location and fetch weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude)
                .then(data => updateUI(data))
                .catch(error => console.error('Error:', error));
        }, error => {
            console.error('Geolocation error:', error);
            alert('Geolocation is not supported or permission denied. Please enter a city name.');
        });
    } else {
        alert('Geolocation is not supported. Please enter a city name.');
    }

    // Event listener for search button click
    document.getElementById('search-btn').addEventListener('click', () => {
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            fetchWeather(city)
                .then(data => updateUI(data))
                .catch(error => console.error('Error:', error));
        } else {
            alert('Please enter a city name.');
        }
    });

    // Fetch weather data by city name
    async function fetchWeather(cityName) {
        const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${accuWeatherApiKey}&q=${cityName}`);
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('City not found');
        }
        const cityKey = data[0].Key;
        const weatherResponse = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${accuWeatherApiKey}`);
        const weatherData = await weatherResponse.json();
        return { city: data[0], weather: weatherData[0] };
    }

    // Fetch weather data by coordinates
    async function fetchWeatherByCoords(latitude, longitude) {
        const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${accuWeatherApiKey}&q=${latitude},${longitude}`);
        const data = await response.json();
        const cityKey = data.Key;
        const weatherResponse = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${accuWeatherApiKey}`);
        const weatherData = await weatherResponse.json();
        return { city: data, weather: weatherData[0] };
    }

// Update UI with weather information
function updateUI({ city, weather }) {
    const cityNameElement = document.getElementById('city-name');
    const weatherIconElement = document.getElementById('weather-icon');
    const weatherDescriptionElement = document.getElementById('weather-description');
    const temperatureElement = document.getElementById('temperature');
    const timeElement = document.getElementById('current-time');

    // Get current time
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeString = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    // Display current time
    timeElement.textContent = `Current Time: ${timeString}`;

    // Update weather information
    cityNameElement.textContent = city.LocalizedName;
    weatherDescriptionElement.textContent = weather.WeatherText;
    temperatureElement.textContent = `${weather.Temperature.Metric.Value}°C`;

    // Set weather icon dynamically based on weather code and description
    const weatherIcon = getWeatherIcon(weather.WeatherIcon, weather.WeatherText);
    weatherIconElement.innerHTML = `<i class="${weatherIcon}" aria-hidden="true"></i>`;

    // Set color for weather icon based on weather description
    setColorForWeatherIcon(weatherDescriptionElement, weather.WeatherText);

    // Determine time of day and adjust weather icon
    const isDayTime = hours > 6 && hours < 18; // Assume day time between 6 AM and 6 PM
    if (!isDayTime) {
        weatherIconElement.classList.add('night'); // Add night class to weather icon
    } else {
        weatherIconElement.classList.remove('night'); // Remove night class if it exists
    }

    // Display weather info after updating
    document.querySelector('.weather-info').style.display = 'block';

    // Trigger animations
    animateElements();
}



    // Function to get weather icon class based on weather code and description
    function getWeatherIcon(weatherCode, weatherDescription) {
        if (weatherDescription.toLowerCase().includes('cloud')) {
            return 'fas fa-cloud';
        } else if (weatherDescription.toLowerCase().includes('sun')) {
            return 'fas fa-sun';
        } else if (weatherDescription.toLowerCase().includes('rain')) {
            return 'fas fa-cloud-showers-heavy';
        } else if (weatherDescription.toLowerCase().includes('thunder')) {
            return 'fas fa-bolt';
        } else if (weatherDescription.toLowerCase().includes('snow')) {
            return 'fas fa-snowflake';
        } else if (weatherDescription.toLowerCase().includes('fog')) {
            return 'fas fa-smog';
        } else {
            return 'fas fa-question-circle'; // Default icon
        }
    }
// Function to set color for weather icon based on weather description
function setColorForWeatherIcon(weatherDescriptionElement, weatherDescription) {
    const weatherIconElement = document.getElementById('weather-icon');
    if (weatherDescription.toLowerCase().includes('cloud')) {
        weatherIconElement.style.color = '#787878'; // Ash color for cloudy weather
    } else if (weatherDescription.toLowerCase().includes('sun') || weatherDescription.toLowerCase().includes('clear')) {
        weatherIconElement.style.color = '#f5e36f'; // Yellow color for sunny weather
    } else if (weatherDescription.toLowerCase().includes('rain')) {
        weatherIconElement.style.color = '#185aad'; // Blue color for rainy weather
    } else if (weatherDescription.toLowerCase().includes('thunder')) {
        weatherIconElement.style.color = '#6c7eb7'; // Purple color for thunderstorm weather
    } else if (weatherDescription.toLowerCase().includes('snow')) {
        weatherIconElement.style.color = '#e8f1ff'; // White color for snowy weather
    } else if (weatherDescription.toLowerCase().includes('fog') || weatherDescription.toLowerCase().includes('haze')) {
        weatherIconElement.style.color = '#c0c0c0'; // Silver color for foggy/hazy weather
    } else {
        // Default color if weather condition is not matched
        weatherIconElement.style.color = '#000'; // Black color
    }
}


});
