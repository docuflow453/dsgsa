import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  Competition, 
  CompetitionDate, 
  CompetitionClass, 
  CompetitionExtra,
  Grade,
  ClassType,
  ClassRule
} from '../models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private apiUrl = `${environment.apiUrl}/competitions`;

  constructor(private http: HttpClient) {}

  getCompetitions(params?: any): Observable<{ count: number; results: Competition[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ count: number; results: Competition[] }>(this.apiUrl + '/', { params: httpParams });
  }

  getCompetition(id: number): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/${id}/`);
  }

  getCompetitionBySlug(slug: string): Observable<Competition> {
    return this.http.get<Competition>(`${environment.apiUrl}/competition/${slug}/`);
  }

  createCompetition(competition: Partial<Competition>): Observable<Competition> {
    return this.http.post<Competition>(this.apiUrl + '/', competition);
  }

  updateCompetition(id: number, competition: Partial<Competition>): Observable<Competition> {
    return this.http.patch<Competition>(`${this.apiUrl}/${id}/`, competition);
  }

  deleteCompetition(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getCompetitionDates(competitionId?: number): Observable<CompetitionDate[]> {
    const params = competitionId ? { competition: competitionId.toString() } : {};
    return this.http.get<CompetitionDate[]>(`${environment.apiUrl}/competition-dates/`, { params });
  }

  getCompetitionClasses(competitionId?: number): Observable<CompetitionClass[]> {
    const params = competitionId ? { competition: competitionId.toString() } : {};
    return this.http.get<CompetitionClass[]>(`${environment.apiUrl}/competition-class/`, { params });
  }

  getCompetitionExtras(competitionId?: number): Observable<CompetitionExtra[]> {
    const params = competitionId ? { competition: competitionId.toString() } : {};
    return this.http.get<CompetitionExtra[]>(`${environment.apiUrl}/competition-extras/`, { params });
  }

  generateRidingOrder(dateId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/competition-dates/${dateId}/generate_riding_order/`, {});
  }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${environment.apiUrl}/grades/`);
  }

  getClassTypes(): Observable<ClassType[]> {
    return this.http.get<ClassType[]>(`${environment.apiUrl}/class-types/`);
  }

  getClassRules(): Observable<ClassRule[]> {
    return this.http.get<ClassRule[]>(`${environment.apiUrl}/class-rules/`);
  }
}

