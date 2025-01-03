import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true, // This makes the pipe standalone
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null, format: string): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

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
          const optionsWithTime: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          };
          return date.toLocaleDateString('en-US', optionsWithTime);

        case 'DD MMM YYYY':
          const dayShort = date.getDate().toString().padStart(2, '0');
          const monthShort = date.toLocaleString('en-US', { month: 'short' });
          const yearShort = date.getFullYear();
          return `${dayShort} ${monthShort} ${yearShort}`;
        
    
      default:
        return date.toISOString();
    }
  }
}
