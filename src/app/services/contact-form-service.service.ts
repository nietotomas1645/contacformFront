import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactForm } from '../models/contact-form.model';

@Injectable({
  providedIn: 'root'
})
export class ContactFormServiceService {

  private apiUrl = 'https://localhost:7161/api/contactform';

  constructor(private http: HttpClient) { }

  submitForm(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: new HttpHeaders(),
    });
  }

  getContactForms(): Observable<ContactForm[]> {
    return this.http.get<ContactForm[]>(this.apiUrl);
  }
  
}
