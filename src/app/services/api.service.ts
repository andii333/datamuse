import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDatamuseResponse } from '../models/datamuse-response';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  url = 'https://api.datamuse.com/words?ml=';

  public getSynonyms(text: string): Observable<IDatamuseResponse[]> {
    return this.http.get<IDatamuseResponse[]>(this.url + text);
  }
}
