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
    if (!value) return '-'; // Return a placeholder for null or undefined values

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
      case 'h:mm A, ddd DD MMM YYYY': {
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        const dayOptions: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };
    
        // Get time in the desired format (e.g., 10.40 AM)
        const timePart = date.toLocaleTimeString('en-US', timeOptions);
    
        // Get date in the desired format (e.g., Tue Jan 21 2025)
        const dayPart = date.toLocaleDateString('en-US', dayOptions);
        
        // Remove the extra comma from the date part
        let formattedDate = dayPart.replace(',', '');
        let formattedDate1 = formattedDate.replace(',', '');
          // console.log("formattedDate",formattedDate1)
        // Return the formatted string
        return `${timePart}, ${formattedDate1}`;
    }
    case 'DD MMM - HH:mm:ss': {
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${day} ${month} - ${hours}:${minutes}:${seconds}`;
  }
  case 'MMM DD, YYYY - h:mm A (UTC)': {
      const utcYear = date.getUTCFullYear();
      const utcMonth = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      const utcDay = date.getUTCDate().toString().padStart(2, '0');
      const utcHours = date.getUTCHours();
      const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
      
      const amPm = utcHours >= 12 ? 'PM' : 'AM';
      const formattedHours = (utcHours % 12 || 12).toString().padStart(2, '0'); // Convert 24-hour to 12-hour format
    
      return `${utcMonth} ${utcDay}, ${utcYear} - ${formattedHours}:${utcMinutes} ${amPm}`;
  }

      default:
        return date.toISOString(); // Default ISO string format
    }
  }
}
