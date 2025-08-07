import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanOfficeName'
})
export class CleanOfficeNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace(/^\.+/, '');
  }

}
