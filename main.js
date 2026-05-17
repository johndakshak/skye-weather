let searchCity = document.querySelectorAll('.search-city');
let APIKey = getAPIkey();

searchCity.forEach((input) => {
    input.addEventListener('keydown', (e) => {

        if (e.key === "Enter"){

            let city = input.value.trim();
            let URL = `https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${city}`;
            
            fetch(URL, {
                method: 'GET'
            })

            .then((res) => res.json())
            .then((data) => {

                if(data.error){
                    console.log('API error', data.error)
                    alert('City not found')
                    return;
                }
                
                if(data.location.name.toLowerCase() === city.toLowerCase()){
                    updateLocation(data);
                    updateDateTime(data);
                    updateCurrentWeather(data);
                    updateMetaData(data);
                    updateConditions(data);
                    dayLight(data);
                    updateHourlyForecast(data);
                }
            })
        }
    });
});

function updateLocation(data){
    let cityLocation = document.querySelectorAll('.location');

    cityLocation.forEach((city) => {
        if(data.location.region){
            city.textContent = `${data.location.name}, ${data.location.region}`;
        }

        if(data.location.region === '')
            city.textContent = `${data.location.name}`;
    });
}

function updateDateTime(data){
    let localDateTime = document.querySelectorAll('.date');
    localDateTime.forEach((date) => {
        date.textContent = `${data.location.localtime}`;
    }); 
}

function updateCurrentWeather(data){
    document.querySelector('.temp-display').textContent = `${data.current.temp_c}`;
    document.querySelector('.condition-txt').textContent = `${data.current.condition.text}`;
    document.querySelector('.fahrenheit').textContent = `${data.current.temp_f}°F`;
    document.querySelector('.updated')   .textContent = `Last Updated ${data.current.last_updated}`;
    document.querySelector('.img').src = `https:${data.current.condition.icon}`;
    document.querySelector('.img').alt = `${data.current.condition.text}`;
    document.querySelector('.humidity').textContent = `${data.current.humidity}`;
    document.querySelector('.wind').textContent = `${data.current.wind_kph}`;
    document.querySelector('.uv').textContent = `${data.current.uv}`;
}

function updateMetaData(data){
    document.querySelector('.city-region').textContent = `${data.location.name}, ${data.location.region}`;
    document.querySelector('.country').textContent = `${data.location.country}`;
    document.querySelector('.latitude').textContent = `Lat ${data.location.lat}`;
    document.querySelector('.longitude').textContent = `Lon ${data.location.lon}`;
    document.querySelector('.timezone').textContent = `${data.location.tz_id}`;
    document.querySelector('.epoch').textContent = `${data.location.localtime_epoch}`;
    document.querySelector('.precipitation').textContent = `${data.current.precip_mm} mm / ${data.current.precip_in} in`;
    document.querySelector('.pressure').textContent = `${data.current.pressure_mb} mb / ${data.current.pressure_in} in`;
    document.querySelector('.last-updated-epoch').textContent = `${data.current.last_updated_epoch}`;
    document.querySelector('.vis').textContent = `${data.current.vis_km} km / ${data.current.vis_miles} miles`;

    // DAY/NIGHT
    if(data.current.is_day === 1){
        document.querySelector('.local-time-date').textContent = `${data.location.localtime} Day ☀️`;
        document.querySelector('.day-night').textContent = `Daytime · ☀️`;
    }
    else{
        document.querySelector('.local-time-date').textContent = `${data.location.localtime} Night 🌙`;
        document.querySelector('.day-night').textContent = `Night time · 🌙`;
    }

    // SNOW
    if(data.current.will_it_snow <= 0){
        document.querySelector('.chance-snow').textContent = `${data.current.chance_of_snow}% · No snow`;
    }
    else{
        document.querySelector('.chance-snow').textContent = `${data.current.chance_of_snow}% · Snow `;
    }

    // CONDITION CODE
    if (data.current.condition.code){
        document.querySelector('.condition-code').textContent = `${data.current.condition.code} · ${data.current.condition.text}`;
    }
    else{
        document.querySelector('.condition-code').textContent = `No Data`;
    }

    // RAIN
    if(data.current.will_it_rain <= 0){
        document.querySelector('.chance-rain').textContent = `${data.current.chance_of_rain}% · Won't Rain`;
    }
    else{
        document.querySelector('.chance-rain').textContent = `${data.current.chance_of_rain}% · Will Rain`;
    }
}

// UPDATE CONDITIONS
function updateConditions(data){
    document.querySelector('.cloud').textContent = `${data.current.cloud}%`;
    document.querySelector('.wind-direction').textContent = `${data.current.wind_dir}`;
    document.querySelector('.humidity-condition').textContent = `${data.current.humidity}`;
    document.querySelector('.visibility').textContent = `${data.current.vis_km} km · ${data.current.vis_miles} miles`;
    document.querySelector('.dew-point').textContent = `${data.current.dewpoint_c}°C · ${data.current.dewpoint_f}°F`;
    document.querySelector('.feels-like').textContent = `${data.current.feelslike_c}°C · ${data.current.feelslike_c}°F`;
    document.querySelector('.short-radiation').textContent = `${data.current.short_rad}`;
}


// UPDATE DAYLIGHT
function dayLight(data){
    if(data.forecast.forecastday[0].day.condition.code){
        document.querySelector('.rain-text').textContent = `${data.forecast.forecastday[0].day.condition.text}`;
        
        document.querySelector('.icon-cond').src = `https:${data.forecast.forecastday[0].day.condition.icon}`;

        document.querySelector('.epoch-cond').textContent = `${data.forecast.forecastday[0].day.condition.code}`;
    }

    document.querySelector('.sunrise').textContent = `${data.forecast.forecastday[0].astro.sunrise}`;
    document.querySelector('.sunset').textContent = `${data.forecast.forecastday[0].astro.sunset}`;
    document.querySelector('.moonrise').textContent = `${data.forecast.forecastday[0].astro.moonrise}`;
    document.querySelector('.moonset').textContent = `${data.forecast.forecastday[0].astro.moonset}`;
    document.querySelector('.moon-illumination').textContent = `${data.forecast.forecastday[0].astro.moon_illumination}%`;
    document.querySelector('.moon-phase').textContent = `${data.forecast.forecastday[0].astro.moon_phase}`;

    // MOON UP/DOWN
    if(data.forecast.forecastday[0].astro.is_moon_up){
        document.querySelector('.is-moon-up').textContent = `🌙 YES`;
    }
    else{
        document.querySelector('.is-moon-up').textContent = `❌ NO`;
    }

    // SUN UP/DOWN
    if(data.forecast.forecastday[0].astro.is_sun_up){
        document.querySelector('.is-sun-up').textContent = `☀️ YES`;
    }
    else{
        document.querySelector('.is-sun-up').textContent = `🌑 NO`;
    }    
        
}

// UPDATE HOURLY FORECAST
function updateHourlyForecast(data){
    let hourlyForecast = data.forecast.forecastday[0].hour;
    let hourlyForecastDisplay = document.querySelector('.hourly-forecast-display');
    
    hourlyForecast.forEach((hour) => {
        hourlyForecastDisplay.innerHTML += `
            <div class="glass-light forecast-item py-3 px-12 flex flex-col items-center gap-2 min-w-[72px]">
                <span class="text-xs text-white/80">${hour.time}</span>
                <span class="text-xs text-white/80">
                    ${hour.is_day ? '☀️ DAY' : '🌙 NIGHT'}
                </span>
                <span class="text-xl"><img src="https:${hour.condition.icon}" alt=""></span>
                <span class="text-white text-sm font-semibold">${hour.condition.text}</span>
            </div>
        `
    });
}


