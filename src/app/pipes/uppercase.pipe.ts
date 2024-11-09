import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase',
  standalone: true
})
export class UppercasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''; // Return empty string if value is falsy
    return value.toUpperCase(); // Convert the string to upper case
  }
}