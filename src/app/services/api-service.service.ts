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
    return this.http.get(`${this.baseUrl}/dashboard-vin-summary?`+ data, {
      headers: this.getHeaders(),
    });
  }

  searchVinDataForUser(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/search-pop-vin?`+ data, {
      headers: this.getHeaders(),
    });
  }

  searchVinDataForUserPopSoap(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/track-vin-pop?`+ data, {
      headers: this.getHeaders(),
    });
  }
  getKPIData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/kpi-data`, {
          headers: this.getHeaders(),
        });
  }
  getCurrentVinData(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-vin-summary?`+ data, {
      headers: this.getHeaders(),
    });
  }

  getPdfData(url:any,data:any): Observable<any> {
    let datas={vins:data}
    return this.http.post(`${this.baseUrl}/export-pdf?`+url,datas,{
          headers: this.getHeaders(),
        });
  }

  getCurrentUpdatedVinData(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-vin-summary-updated?`+ data, {
      headers: this.getHeaders(),
    });
  }
  
  getNewAlertData(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/new-alerts?`+ data, {
      headers: this.getHeaders(),
    });
  }
   
  getVinHistoryData(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/title-detail-history?`+ data, {
      headers: this.getHeaders(),
    });
  }
  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/total-unread-alert`, {
      headers: this.getHeaders(),
    });
  } 

 getTopTenNotification(data:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/notification-top-ten?${data}`, {
      headers: this.getHeaders(),
    });
  }

  updateSeenAlertData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/seen-alert?`+ data, {
      headers: this.getHeaders(),
    });
  }
  getUnreadNotificationData(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/unread-notification?`+ data, {
      headers: this.getHeaders(),
    });
  }

}