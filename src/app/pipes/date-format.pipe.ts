import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true, // Allows standalone usage of the pipe
})
@Injectable({
  providedIn: 'root', // Makes the pipe injectable for services
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null, format: string): string {
    if (!value) return 'N/A'; // Return a placeholder for null or undefined values

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Handle invalid date inputs
    }

    const now = new Date();

    switch (format) {
      case 'DD MM YYYY': {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      }

      case 'YYYY':
        return date.getFullYear().toString();

      case 'MMM DD YYYY': {
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
      }

      case 'MMM DD, YYYY - h:mm A': {
        const dateOptions: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };

        const datePart = date.toLocaleDateString('en-US', dateOptions);
        const timePart = date.toLocaleTimeString('en-US', timeOptions);

        return `${datePart} - ${timePart}`;
      }

      case 'DD MMM YYYY': {
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      }

      case 'relative': {
        const createdYear = date.getFullYear();
        const createdMonth = date.getMonth();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        if (createdYear === currentYear && createdMonth === currentMonth) {
          return 'This month';
        }

        const monthsDifference =
          (currentYear - createdYear) * 12 + (currentMonth - createdMonth);

        if (monthsDifference === 1) {
          return '1 month ago';
        }

        return `${monthsDifference} months ago`;
      }

      default:
        return date.toISOString(); // Default ISO string format
    }
  }
}
