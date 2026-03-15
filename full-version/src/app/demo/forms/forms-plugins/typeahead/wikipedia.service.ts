import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {
  private http = inject(HttpClient);

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    // eslint-disable-next-line
    return this.http.get<[any, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) }).pipe(map((response) => response[1]));
  }
}
