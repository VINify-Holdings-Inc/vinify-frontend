import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.api_url; // Ensure the URL is correct and accessible

  constructor(private http: HttpClient, private sessionService: SessionService,) {}

  private getHeaders(): HttpHeaders {
    const token = this.sessionService.getSessionData('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

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
    return this.http.post(`${this.baseUrl}/csv-import`, data,{
      headers:this.getHeaders(),
    });
  }

  insertSheet2Data(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/csv-import-sheet2`, data,{
      headers:this.getHeaders(),
    });
  }
  sendContactUsMessage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact-us`, data,{
      headers: this.getHeaders(),
    });
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/user-profile-update`, data);
  } 
    
  checkTokenData(data: any): Observable<any> {
   
    return this.http.post(`${this.baseUrl}/reset-token-check`, data);
  }

  getProfileData(data: any): Observable<any> {
   
    return this.http.get(`${this.baseUrl}/user-profile/`+ data, {
          headers: this.getHeaders(),
        });
  }

  // getProfileData(data: any): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/user-profile/${data}`, {
  //     headers: this.getHeaders(),
  //   });
  // }

}

@Injectable({
  providedIn: 'root',
})
export class userData {
  private baseUrl = environment.api_url; // Ensure the URL is correct and accessible

  constructor(private http: HttpClient,private sessionService: SessionService,) {}

  private getHeaders(): HttpHeaders {
    const token = this.sessionService.getSessionData('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getCurrentVinDataForUser(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/csv-import-sheet2?`+ data, {
      headers: this.getHeaders(),
    });
  }

  searchVinDataForUser(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/search-pop-vin?`+ data, {
      headers: this.getHeaders(),
    });
  }

    
}
