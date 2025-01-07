import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true, // This makes the pipe standalone
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null, format: string): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    const now = new Date();
    switch (format) {
      case 'DD MM YYYY':
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;

      case 'YYYY':
        return date.getFullYear().toString();

      case 'MMM DD YYYY':
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
      case 'MMM DD, YYYY - h:mm A':
        const optionsWithDate: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        const optionsWithTime: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };
      
        // Format date and time separately
        const datePart = date.toLocaleDateString('en-US', optionsWithDate);
        const timePart = date.toLocaleTimeString('en-US', optionsWithTime);
      
        // Combine with custom separator
        return `${datePart} - ${timePart}`;

        case 'DD MMM YYYY':
          const dayShort = date.getDate().toString().padStart(2, '0');
          const monthShort = date.toLocaleString('en-US', { month: 'short' });
          const yearShort = date.getFullYear();
          return `${dayShort} ${monthShort} ${yearShort}`;
          case 'relative': {
            // Calculate months difference
            const createdYear = date.getFullYear();
            const createdMonth = date.getMonth();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
    
            if (createdYear === currentYear && createdMonth === currentMonth) {
              return 'This month';
            }
    
            const monthsDifference =
              (currentYear - createdYear) * 12 + (currentMonth - createdMonth);
    
            if (monthsDifference === 1) return '1 month ago';
            return `${monthsDifference} months ago`;
          }
    
      default:
        return date.toISOString();
    }
  }
}
