import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment.prod';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class SoapService {
 private baseUrl = environment.api_url;
 constructor(private http: HttpClient) {}

  getToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-soap-token`);
  }

  getVinData(data:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/new-validate-vin-data`,data);
  }

  
}
