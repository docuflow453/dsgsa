import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Horse, HorseBreed, HorseColour, BreedType, StudFarm } from '../models/horse.model';

@Injectable({
  providedIn: 'root'
})
export class HorseService {
  private apiUrl = `${environment.apiUrl}/horses`;

  constructor(private http: HttpClient) {}

  getHorses(params?: any): Observable<{ count: number; results: Horse[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ count: number; results: Horse[] }>(this.apiUrl + '/', { params: httpParams });
  }

  getHorse(id: number): Observable<Horse> {
    return this.http.get<Horse>(`${this.apiUrl}/${id}/`);
  }

  createHorse(horse: Partial<Horse>): Observable<Horse> {
    return this.http.post<Horse>(this.apiUrl + '/', horse);
  }

  updateHorse(id: number, horse: Partial<Horse>): Observable<Horse> {
    return this.http.patch<Horse>(`${this.apiUrl}/${id}/`, horse);
  }

  deleteHorse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  searchHorses(query: string): Observable<Horse[]> {
    return this.http.get<Horse[]>(`${environment.apiUrl}/horse-search/`, {
      params: { q: query }
    });
  }

  getBreeds(): Observable<HorseBreed[]> {
    return this.http.get<HorseBreed[]>(`${environment.apiUrl}/breeds/`);
  }

  getBreedTypes(): Observable<BreedType[]> {
    return this.http.get<BreedType[]>(`${environment.apiUrl}/breed-types/`);
  }

  getColours(): Observable<HorseColour[]> {
    return this.http.get<HorseColour[]>(`${environment.apiUrl}/horse-colors/`);
  }

  getStudFarms(): Observable<StudFarm[]> {
    return this.http.get<StudFarm[]>(`${environment.apiUrl}/stud-farms/`);
  }
}

