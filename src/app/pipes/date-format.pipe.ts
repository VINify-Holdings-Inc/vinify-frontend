import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
@Injectable({
  providedIn: 'root',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null, format: string): string {
    if (!value) return ' ';

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return ' ';

    const now = new Date();

    // Get UTC parts for global consistency
    const utcDay = date.getUTCDate().toString().padStart(2, '0');
    const utcMonthIndex = date.getUTCMonth(); // 0-based
    const utcMonth = date.toLocaleString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    });
    const utcYear = date.getUTCFullYear();
    const utcHours = date.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const utcSeconds = date.getUTCSeconds().toString().padStart(2, '0');

    switch (format) {
      case 'DD MM YYYY':
        return `${utcDay} ${(utcMonthIndex + 1).toString().padStart(2, '0')} ${utcYear}`;

      case 'YYYY':
        return utcYear.toString();

      case 'MMM DD YYYY':
        return `${utcMonth} ${utcDay} ${utcYear}`;

      case 'MMM DD, YYYY - h:mm A': {
        const localDate = new Date(date);
        const datePart = localDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const timePart = localDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        return `${datePart} - ${timePart}`;
      }

      case 'DD MMM YYYY':
        return `${utcDay} ${utcMonth} ${utcYear}`;

      case 'relative': {
        const createdYear = date.getUTCFullYear();
        const createdMonth = date.getUTCMonth();
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth();

        if (createdYear === currentYear && createdMonth === currentMonth) {
          return 'This month';
        }

        const monthsDifference =
          (currentYear - createdYear) * 12 + (currentMonth - createdMonth);

        return monthsDifference === 1
          ? '1 month ago'
          : `${monthsDifference} months ago`;
      }

      case 'h:mm A, ddd DD MMM YYYY': {
        const localDate = new Date(date);
        const timePart = localDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        const dayPart = localDate.toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const formatted = dayPart.replace(/,/g, '');
        return `${timePart}, ${formatted}`;
      }

      case 'DD MMM - HH:mm:ss':
        return `${utcDay} ${utcMonth} - ${utcHours}:${utcMinutes}:${utcSeconds}`;

      case 'MMM DD, YYYY - h:mm A (UTC)': {
        const utcHour12 = (+utcHours % 12 || 12).toString().padStart(2, '0');
        const amPm = +utcHours >= 12 ? 'PM' : 'AM';
        return `${utcMonth} ${utcDay}, ${utcYear} - ${utcHour12}:${utcMinutes} ${amPm}`;
      }

      // Explicit string case for '2007-09-27' format (handled via default date parsing)
      case 'global-YYYY-MM-DD': {
        // Converts to consistent format like "27 Sep 2007"
        return `${utcDay} ${utcMonth} ${utcYear}`;
      }

      default:
        // ISO format fallback
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    }
  }
}
