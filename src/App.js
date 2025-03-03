import "./App.css";
import React, { useState } from "react";
import { deleteIcon, searchIcon } from "./svgSource";
import moment from "moment";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const API_KEY = "88f8358788392b814695a5ec18657805";

  const fetchWeather = (cityName) => {
    if (!cityName) return;
    setError(null);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(" Not Found");
        }
        return response.json();
      })
      .then((data) => {
        const unixTimestamp = data.dt; // Unix time from API
        const timezoneOffset = data.timezone; // Timezone offset in seconds

        const formattedTime = moment
          .unix(unixTimestamp)
          .utcOffset(timezoneOffset / 60)
          .format("DD-MM-YYYY hh:mm A");

        setWeather({ ...data, localTime: formattedTime });
        setSearchHistory((prevHistory) => {
          const exists = prevHistory.some(
            (item) => item.city.toLowerCase() === cityName.toLowerCase()
          );
          return exists
            ? prevHistory
            : [
                {
                  city: data.name,
                  time: formattedTime,
                  country: data.sys.country,
                },
                ...prevHistory,
              ];
        });
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const removeHistoryItem = (itemToRemove) => {
    setSearchHistory(
      searchHistory.filter((item) => item.city !== itemToRemove)
    );
  };

  return (
    <div
      className="rootContainer"
      style={{ backgroundImage: `url(/bg-light.png)` }}
    >
      <div className="pageContainer">
        <div className="searchBox">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="searchButton" onClick={() => fetchWeather(city)}>
            {searchIcon()}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="weatherContainer">
          <img src="/sun.png" className="image" />
          {weather && (
            <div className="weatherCard">
              <div className="weatherDetails">
                <div>
                  <div>Today's Weather</div>
                  <div className="temperature">{weather.main.temp}°</div>
                  <div className="countryName">
                    {weather.name}, {weather.sys.country}
                  </div>
                </div>
                <div className="weatherDetailsText">
                  <div>{weather.weather[0].main}</div>
                  <div>Humidity: {weather.main.humidity}%</div>
                  <div>{weather.localTime}</div>
                </div>
              </div>
            </div>
          )}
          <div className="historyContainer">
            <div className="historyTitle">Search History</div>
            <div className="historyList">
              {searchHistory.map((item, index) => (
                <div key={index} className="historyItem">
                  <div className="textContainer">
                    <span>
                      {item.city}, {item.country}
                    </span>
                    <span className="timestamp">{item.time}</span>
                  </div>
                  <div className="buttonContainer">
                    <button
                      className="listButton"
                      onClick={() => fetchWeather(item.city)}
                    >
                      {searchIcon()}
                    </button>
                    <button
                      className="listButton"
                      onClick={() => removeHistoryItem(item.city)}
                    >
                      {deleteIcon()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
