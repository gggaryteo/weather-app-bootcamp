import React from "react";
import logo from "./logo.png";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      currentCity: "",
      currentTemp: "",
      currentWeather: "",
      currentWeatherDescription: "",
      weatherIconCode: "",
      fiveDayAPI: {},
      fiveDayForecastState: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${this.state.userInput}&limit=1&appid=eb81afa8f89226e83dfe419d7085ef94`
      )
      .then((response) => response.data[0])
      // Write remaining logic once we understand response format
      .then((cityGeoData) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&units=metric&appid=eb81afa8f89226e83dfe419d7085ef94&units=metric`
        )
      )
      .then((response) => {
        const { data: weatherData } = response;
        console.log(weatherData);
        this.setState({
          userInput: "",
          currentCity: weatherData.name,
          currentTemp: weatherData.main.temp,
          currentWeather: weatherData.weather[0].main,
          weatherIconCode: weatherData.weather[0].icon,
          currentWeatherDescription: weatherData.weather[0].description,
        });
      })
      
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const weatherInformation = (
      <div className="weatherInformation">
        <img className="weather-icon"
          src={`http://openweathermap.org/img/wn/${this.state.weatherIconCode}@2x.png`}
          alt="weatherIcon"
        />
        <br/>
        <label>Current City : {this.state.currentCity}</label>
        <br />
        <label>Current Temperature : {this.state.currentTemp}</label>
        <br />
        <label>
          Current Weather : {this.state.currentWeather}
          <br />
          Description: {this.state.currentWeatherDescription}
        </label>
      </div>
    );


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Weather App</p>
          <h5>Which City Will You Like To Search For? </h5>
          <form onSubmit={this.handleSubmit}>
            <label style={{ fontSize: "25px" }}>
              City:
              <input
                type="text"
                name="userInput"
                value={this.state.userInput}
                onChange={this.handleChange}
                style={{ margin: "6px", fontSize: "20px" }}
                placeholder="Provide a city here!"
              />
            </label>
            <input type="submit" value="Check Weather" style={{ fontSize: "20px" }} />
          </form>
          {this.state.currentCity && weatherInformation}
        </header>
      </div>
    );
  }
}

export default App;
