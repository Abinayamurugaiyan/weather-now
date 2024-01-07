import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  catchError,
  merge,
  mergeMap,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
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

  constructor(private weatherService: WeatherService) {
    this.weatherUnits = [] as weather[];
    this.weatherUnit = {} as weather;
  }

  ngOnInit(): void {
    // First, get the user's location coordinates using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        this.showCity(res);
      });
    }
  }

  // Then, pass the location coordinates to a Geocoding API to get the city name
  // Make a request to a Geocoding API (e.g. Google Maps Geocoding API)
  showCity(position: any): void {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.weatherService
      .getWeather(latitude, longitude)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log('city', res);
        let resCopy = structuredClone(res);
        resCopy.main.temp = Math.round(resCopy.main.temp);
        resCopy.main.temp_max = Math.round(resCopy.main.temp_max);
        resCopy.main.temp_min = Math.round(resCopy.main.temp_min);
        this.weatherMain = resCopy;
        this.city = res?.name;
        this.mapWeatherUnit(resCopy);
      });
  }

  mapWeatherUnit(res: any): void {
    let arr = Object.entries(res.main);
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
