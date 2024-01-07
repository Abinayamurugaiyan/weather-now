import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseWeatherURL =
    'https://api.openweathermap.org/data/2.5/weather?lat=';
  private urlSuffix = '&units=metric&APPID=5f3829df0a28dcb8bdb2d16961a3c018';
  private API_KEY = 'AIzaSyAMQNJ7elKgvU9q3xDam3Eixkz_7wIh2oo';

  private googleApi =
    'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  private googleApiSuffix = '&key=AIzaSyAMQNJ7elKgvU9q3xDam3Eixkz_7wIh2oo';
  constructor(private http: HttpClient) {}

  getWeather(lat: string, long: string): Observable<any> {
    console.log(location);
    return this.http
      .get(this.baseWeatherURL + `${lat}&lon=${long}` + this.urlSuffix)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err?.status === 404) {
            console.log(`City ${location} not found`);
          } else if (err) {
            console.log('error occurs', err);
          }
          return throwError(err.status);
        })
      );
  }

  fetchCurrentLocation(latitude: string, longitude: string): Observable<any> {
    return this.http
      .get(this.googleApi + latitude + ',' + longitude + this.googleApiSuffix)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err?.status === 404) {
            console.log(`City ${location} not found`);
          } else if (err) {
            console.log(err);
          }
          return throwError(err.status);
        })
      );
  }
}
