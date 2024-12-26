import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.api_url; // Ensure the URL is correct and accessible

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-login`, data);
  }

  forgetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forget-password`, data);
  }

  resetPwd(data:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  
  insertData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bulkInsertData`, data);
  }

  insertSheet2Data(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bulkInsertSheet2Data`, data);
  }
  sendContactUsMessage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact-us`, data);
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/user-profile-update`, data);
  } 
    
  checkTokenData(data: any): Observable<any> {
   
    return this.http.post(`${this.baseUrl}/reset-token-check`, data);
  }

}

@Injectable({
  providedIn: 'root',
})
export class userData {
  private baseUrl = environment.api_url; // Ensure the URL is correct and accessible

  constructor(private http: HttpClient) {}

  getCurrentVinDataForUser(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/csv-import-sheet2?`+ data);
  }

    
}
