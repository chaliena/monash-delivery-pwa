import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'departmentName',
  standalone: true
})
export class DepartmentNamePipe implements PipeTransform {
  private departmentNameMap: { [key: string]: string } = {
    'food': 'Food',
    'furniture': 'Furniture',
    'electronic': 'Electronic',
  };

  transform(department: string): string {
    return this.departmentNameMap[department] || department; // Default to the key if not found
  }
}
