import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateText',
    standalone: true
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string | undefined, limit: number): string {
    if (!value) {
      return '';
    }
    if (value.length > limit) {
      // Remove trailing commas if present
      while (value.charAt(limit - 1) === ',') {
        limit--;
      }
      return value.substring(0, limit) + '...';
    }
    return value;
  }
}
