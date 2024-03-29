import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, of, throwError } from 'rxjs';
import { API_KEY } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // private baseWeatherURL =
  //   'https://api.openweathermap.org/data/2.5/weather?lat=';

  private baseWeatherURL =
    'https://api.openweathermap.org/data/3.0/onecall?lat=';
  private urlSuffix = '&units=metric&APPID=5f3829df0a28dcb8bdb2d16961a3c018';
  // private googleApi =
  //   'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  // private googleApiSuffix = '&key=';

  private apiKey = API_KEY;
  constructor(private http: HttpClient) {}

  getCityNameByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${this.apiKey}&q=${lat}+${lon}&pretty=1`;
    return this.http.get(url);
  }

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
}
