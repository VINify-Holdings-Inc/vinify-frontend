import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }


  // Set data in sessionStorage
  setSessionData(key: string, data: any): void {
    
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  // Get data from sessionStorage
  getSessionData(key: string): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Remove data from sessionStorage
  removeSessionData(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear all sessionStorage data
  clearSession(): void {
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    // For example, check if a JWT token is stored in localStorage
    return !!sessionStorage.getItem('token');
  }

}
