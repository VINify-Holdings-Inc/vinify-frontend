import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilServiceService {

 /**
   * Convert a date to DD MM YYYY format.
   * @param date The input date.
   */
  formatToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Convert a date to YYYY format.
   * @param date The input date.
   */
  formatToYYYY(date: Date): string {
    return date.getFullYear().toString();
  }

  /**
   * Convert a date to "MMM DD YYYY" format.
   * @param date The input date.
   */
  formatToMMMDDYYYY(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}
