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

@Injectable({
  providedIn: 'root' // Ensure the service is available globally
})

export class NotificationService {
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable(); // Observable for components to subscribe

  setUnreadCount(count: number) {
    this.unreadCount.next(count); // Update count
  }

  decrementUnreadCount() {
    const currentCount = this.unreadCount.value;
    if (currentCount > 0) {
      this.unreadCount.next(currentCount - 1); // Decrease count
    }
  }
}
