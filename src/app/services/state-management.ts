import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public profileDataSubject = new BehaviorSubject<any>(this.getInitialProfileData());
  profileData$ = this.profileDataSubject.asObservable();

  constructor() {}

  // Initialize data from localStorage
  public getInitialProfileData() {
    const data = localStorage.getItem('profileData');
    return data ? JSON.parse(data) : { name: '', profilePic: '',profileComplete:"" };
  }

  // Update the profile data
  public updateProfileData(updatedData: any) {
    localStorage.setItem('profileData', JSON.stringify(updatedData));
    this.profileDataSubject.next(updatedData); // Notify subscribers
  }
}
