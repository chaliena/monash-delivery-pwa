import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgToG',
  standalone: true
})
export class KgToGPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '0g'; // Return a default value if input is null or NaN
    }
    const grams = value * 1000; // Convert kg to grams
    return `${grams}g`; // Append 'g' and return
  }
}