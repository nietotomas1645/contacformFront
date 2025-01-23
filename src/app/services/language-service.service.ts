import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageServiceService {

  private apiUrl = 'https://localhost:7161/api/translation';

  constructor(private http: HttpClient) { }

  getTranslations(language: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${language}`);
  }

  getLanguages() {
    return [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'Inglés' },
      { code: 'it', name: 'Italiano' }
    ];
  }
}
