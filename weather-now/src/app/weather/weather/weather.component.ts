import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subject, take } from 'rxjs';
import { weather } from 'src/app/utils/weather.interface';
import { WeatherService } from 'src/app/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  city: string = '';
  weatherMain: any;
  weatherUnits: weather[];
  weatherUnit: weather;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe
  ) {
    this.weatherUnits = [] as weather[];
    this.weatherUnit = {} as weather;
  }

  ngOnInit(): void {
    // First, get the user's location coordinates using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        this.weatherService
          .getCityNameByCoordinates(res.coords.latitude, res.coords.longitude)
          .subscribe(
            (data: any) => {
              console.log('dataaa', data);
              // Assuming the city name is in the first result
              if (data.results.length > 0) {
                this.city = data.results[0].components.town;
              }
            },
            (error) => {
              console.error('Error getting city name:', error);
            }
          );
        this.showCity(res);
      });
    }
  }

  // Then, pass the location coordinates to a Geocoding API to get the city name
  // Make a request to a Geocoding API (e.g. Google Maps Geocoding API)
  showCity(position: any): void {
    console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.weatherService
      .getWeather(latitude, longitude)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log('city', res);
        let resCopy = structuredClone(res);
        resCopy.current.temp = Math.round(resCopy.current.temp);
        resCopy.daily[0].temp.max = Math.round(resCopy.daily[0].temp.max);
        resCopy.daily[0].temp.min = Math.round(resCopy.daily[0].temp.min);
        this.weatherMain = resCopy;
        this.mapWeatherUnit(resCopy);
        this.roundForecastTemp();
      });
  }

  roundForecastTemp(): void {
    this.weatherMain.daily.map((val: any) => {
      val.temp.max = Math.round(val?.temp?.max);
      val.temp.min = Math.round(val?.temp?.min);
      const date = new Date(val.dt * 1000); // Convert seconds to milliseconds
      val.dt = this.datePipe.transform(date, 'EEEE'); // 'EEEE' represents the full name of the day
    });
  }

  mapWeatherUnit(res: any): void {
    const filteredProperties = [
      'sunrise',
      'feels_like',
      'humidity',
      'pressure',
      'wind_gust',
      'wind_speed',
      'uvi',
    ];
    const filteredObject = Object.fromEntries(
      Object.entries(res?.current).filter(([key]) =>
        filteredProperties.includes(key)
      )
    );
    let arr = Object.entries(filteredObject);
    for (let val of arr) {
      console.log(val);
      this.weatherUnit.title = val[0];
      this.weatherUnit.value = val[1];
      this.weatherUnits.push(this.weatherUnit);
      this.weatherUnit = {} as weather;
    }
    console.log(this.weatherUnits);
  }
}
